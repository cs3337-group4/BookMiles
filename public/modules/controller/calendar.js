// class Calendar takes care of storing the calendar internally in module Controller

function Calendar() {
  this.TIMES = [
    "6:00AM",
    "8:00AM",
    "10:00AM",
    "12:00PM",
    "2:00PM",
    "4:00PM",
    "6:00PM",
    "8:00PM",
    "10:00PM",
    "12:00APM"
  ];

  this.DAYS = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
  ];

  this.calendar = [];

  for (var id in this.TIMES) {
    var i = parseInt(id);
    this.calendar[i] = [];
    this.calendar[i][0] = this.TIMES[i];
    for (var j=1; j<8; j++)
      this.calendar[i].push("");
  }
}

Calendar.prototype.timeSlots = function() {
  return this.TIMES.length;
}

Calendar.prototype.getTime = function(i) {
  return this.TIMES[i];
}

Calendar.prototype.findTime = function(time) {
  var r = -1;
  for (var i in this.TIMES) {
    if (this.TIMES[i] == time)
      r = parseInt(i);
  }
  return r;
}

Calendar.prototype.daySlots = function() {
  return this.DAYS.length;
}

Calendar.prototype.getDay = function(i) {
  return this.DAYS[i-1];
}

Calendar.prototype.findDay = function(day) {
  var r = -1;
  for (var i in this.DAYS) {
    if (this.DAYS[i] == day)
      r = parseInt(i);
  }
  return r+1;
}

Calendar.prototype.addEvent = function(event, day, time) {
  var t = this.findTime(time);
  var d = this.findDay(day);
  this.calendar[t][d] = event;
}

Calendar.prototype.getEvent = function(day, time) {
  var t = this.findTime(time);
  var d = this.findDay(day);
  if (this.calendar[t] && d>0)
    return this.calendar[t][d];
  else
    return null;
}

Calendar.prototype.getFullCalEvent = function(day, time) {
  
}

Calendar.prototype.draw = function() {
  return [[
    "",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
  ]].concat(this.calendar);
}
