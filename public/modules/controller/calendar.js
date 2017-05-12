// class Calendar takes care of storing the calendar internally in module Controller
function Calendar() {
  this.id = 0;
  this.events = [];
}

Calendar.prototype.addEvent = function(title, text, start, end) {
  this.events.push({
    id: this.id,
    title: title,
    text: text,
    backgroundColor: "#f06020",
    start: start,
    end: end
  })
  this.id++;
}

Calendar.prototype.parseEvent = function(event, color) {
  //console.log(event);
  var start = event.start.dateTime;
  var end = event.end.dateTime;

  // handle really old Google Calendar event format
  if(!start)
    start = event.start.date;
  if(!end)
    end = event.end.date;

  var pevent = {
    id: this.id,
    title: event.summary,
    text: event.description,
    backgroundColor: color,
    start: start,
    end: end,
    readonly: true
  };
  this.id++;

  this.events.push(pevent);
}

Calendar.prototype.getEvent = function(id) {
  for (var e in this.events) {
    if (this.events[e].id == id)
      return this.events[e];
  }
  return null;
}

Calendar.prototype.deleteEvent = function(id) {
  for (var e in this.events) {
    var event = this.events[e];
    if (event.id == id)
      this.pop(event);
  }
}

Calendar.prototype.manageEvents = function(rdays, book) {
  //console.log(rdays);
  for (var i in rdays) {
    var slots = generateTimeSlots(22, 6);
    var date = new Date(rdays[i].date);
    var time = rdays[i].time;
    console.log(rdays[i].date);
    console.log(time);

    var ryear = date.getFullYear();
    var rmonth = date.getMonth();
    var rdate = date.getDate();

    for (var e in this.events) {
      var event = this.events[e];
      var start = new Date(event.start);
      var syear = start.getFullYear();
      var smonth = start.getMonth();
      var sdate = start.getDate();

      if (ryear==syear && rmonth==smonth && rdate==sdate) {
        var end = new Date(event.end);
        var shour = start.getHours();
        var smin = start.getMinutes();
        var ehour = end.getHours();
        var emin = end.getMinutes();
        shour += smin / 60;
        ehour += emin / 60;

        for (var j in slots) {
          var hour = parseInt(slots[j].substring(0,2));
          var min = parseInt(slots[j].substring(3,5));
          hour += min / 60;
          if (hour >= shour && hour <= ehour) {
            slots[j] = slots[slots.length-1];
            slots.pop();
          }
        }
      }
    }

    slots.sort();
    var rstart;
    var rend;

    do {
      var factor = Math.round(time * 2);
      var index = Math.round(Math.random() * (slots.length - factor -1));
      rstart = ryear + "-" + ((rmonth+1) < 10 ? "0" + (rmonth+1) : (rmonth+1)) + "-" + (rdate < 10 ? "0" + rdate : rdate) + "T" + slots[index] + ":00.000Z";
      rend = ryear + "-" + ((rmonth+1) < 10 ? "0" + (rmonth+1) : (rmonth+1)) + "-" + (rdate < 10 ? "0" + rdate : rdate) + "T" + slots[index + factor] + ":00.000Z";
    }
    while(!verifyTime(time, rstart, rend));

    this.addEvent("Read " + book.title, "Generated by BOSS Calendar", (new Date(rstart)).toISOString(), (new Date(rend)).toISOString());
  }
}

function generateTimeSlots(sleepStart, sleepEnd) {
  var slots = [];

  var dummy = new Date("2000-01-01T00:00:00");
  for (var i=0; i<48; i++) {
    var hour = dummy.getHours();
    var min = dummy.getMinutes();
    var slot = (hour < 10 ? "0" + hour : hour) + ":" + (min < 10 ? "0" + min : min);
    dummy.setMinutes(min + 30);
    var ahour = hour + min / 60;
    if (ahour < sleepStart && ahour > sleepEnd)
      slots.push(slot);
  }

  return slots;
}

function verifyTime(time, start, end) {
  var shour = (new Date(start)).getTime() / (60 * 60 * 1000);
  var ehour = (new Date(end)).getTime() / (60 * 60 * 1000);
  var hour = ehour - shour;
  //console.log(hour);
  //console.log(Math.abs(Math.round(time - hour)) < 1);
  if(Math.abs(Math.round(time - hour)) < 1)
    return true;
  return false;
}