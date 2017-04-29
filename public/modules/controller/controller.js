function Controller(output, handlers) {
  this.module = {};
  this.prefs = new Preferences();
  this.cal = new Calendar();

  // dummy data, to be replaced with data from Schedule Manager module
  this.cal.addEvent("BIOL1010", "Monday", "4:00PM");
  this.cal.addEvent("BIOL1010", "Monday", "6:00PM");
  this.cal.addEvent("CS3035", "Tuesday", "8:00AM");
  this.cal.addEvent("CS3035", "Tuesday", "10:00AM");
  this.cal.addEvent("CS3186", "Tuesday", "6:00PM");
  this.cal.addEvent("BIOL1010", "Wednesday", "6:00PM");
  this.cal.addEvent("CS3035", "Thursday", "8:00AM");
  this.cal.addEvent("CS3035", "Thursday", "10:00AM");
  this.cal.addEvent("CS3186", "Thursday", "6:00PM");
  this.cal.addEvent("CS3801", "Friday", "4:00PM");
  this.cal.addEvent("CS3801", "Friday", "6:00PM");
  this.cal.addEvent("CS3337", "Saturday", "10:00AM");
  this.cal.addEvent("CS3337", "Saturday", "12:00PM");
  this.cal.addEvent("CS3337", "Saturday", "2:00PM");

  var c = this;

  this._callback = function(event, config) {
    console.log(output);
    var x = 0;
    var y = 0;

    if (config) {
      x = config.x;
      y = config.y;
    }
    // handling event callbacks from the display
    switch(event) {
      case "ClickEvent":
        var t = c.cal.getTime(y-1);
        var d = c.cal.getDay(x);
        var e = c.cal.getEvent(d, t);
        console.log("clicked on (" + x + "," + y + "): " + e);
        if (e != null)
          c.display.render("event_edit", {cal:c.cal, e:e, x:x, y:y});
        break;

      case "SaveEvent":
        var t = c.cal.getTime(y-1);
        var d = c.cal.getDay(x);
        var e = output.getElementById("event").value;
        c.cal.addEvent(e, d, t);
        c.display.render("calendar", {cal:c.cal});
        break;

      case "BookAddEvent":
        var book = output.getElementById("book").value;
        var freq = output.getElementById("freq").value;
        if (!freq || freq == "more than 3 times") freq = 7;
        console.log("Confirm adding " + book + " at " + freq);
        for (var i=0; i<freq; i++)
          addBookEvent(c.cal, "Read \"" + book + "\"");
        c.display.render("calendar", {cal:c.cal});
        break;

      case "SaveSettings":
        c.display.render("calendar", {cal:c.cal});
        break;

      case "DisplayTable":
        c.display.render("calendar", {cal:c.cal});
        break;

      case "AddProject":
        c.display.render("book_add", null);
        break;

      case "DisplaySettings":
        c.display.render("settings", c.prefs.appconfig);
        break;
    }
  }

  this.display = new DisplayHTML(output, handlers, this._callback);
}

Controller.prototype.execute = function() {
  console.log("Launching BOSS Calendar Controller");
  this.display.render("calendar", {cal:this.cal});
}

// todo: separate this into Book Manager module
function addBookEvent(cal, book) {
  var t_slots = cal.timeSlots();
  var d_slots = cal.daySlots();

  var queue = [];

  // queue the days of the week and count how many events are in each
  for (var i=0; i<d_slots; i++) {
    queue[i] = 0;
    var d = cal.getDay(i+1);
    for (var j=0; j<t_slots; j++) {
      var t = cal.getTime(j);
      var e = cal.getEvent(d, t);
      if (e != "")
        queue[i] += 1;
    }
  }

  var min = queue[0];
  var min_i = 0;

  // find the day with the least events
  for (var i in queue) {
    if (queue[i] < min) {
      min_i = parseInt(i);
      min = queue[i];
    }
  }

  var times = [];
  var times_i = 0;
  var d = cal.getDay(min_i+1);

  for (var i=0; i<t_slots; i++) {
    var t = cal.getTime(i);
    var e = cal.getEvent(d, t);
    if (e == "") {
      times[times_i] = t;
      times_i += 1;
    }
  }

  var rand_t = Math.floor(Math.random() * times.length);
  var t = times[rand_t];

  cal.addEvent(book, d, t);
}

$(document).ready(function() {
  this.handlers = {};
  var c = new Controller(document, this.handlers);
  c.execute();
  $('#calendar').fullCalendar({
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month,basicWeek,basicDay'
      },
      defaultDate: '2017-04-29',
      navLinks: true, // can click day/week names to navigate views
      editable: true,
      eventLimit: true, // allow "more" link when too many events
      events: [
        {
          title: 'BIOL1010 Lab Meeting',
          start: '2017-04-24T15:00:00',
          end: '2017-04-24T17:00:00'
        },
        {
          title: 'BIOL1010 Class Meeting',
          start: '2017-04-24T18:00:00',
          end: '2017-04-24T19:00:00'
        },
        {
          title: 'CS3035 Class Meeting',
          start: '2017-04-25T08:50:00',
          end: '2017-04-25T10:50:00'
        },
        {
          title: 'CS3186 Class Meeting',
          start: '2017-04-25T18:00:00',
          end: '2017-04-25T19:20:00'
        },
        {
          title: 'BIOL1010 Class Meeting',
          start: '2017-04-26T18:00:00',
          end: '2017-04-26T19:00:00'
        },
        {
          title: 'CS3035 Class Meeting',
          start: '2017-04-27T08:50:00',
          end: '2017-04-27T10:50:00'
        },
        {
          title: 'CS3186 Class Meeting',
          start: '2017-04-27T18:00:00',
          end: '2017-04-27T19:20:00'
        },
        {
          title: 'CS3801 Class Meeting',
          start: '2017-04-28T16:00:00',
          end: '2017-04-28T20:00:00'
        },
        {
          title: 'CS3337 Class Meeting',
          start: '2017-04-29T11:30:00',
          end: '2017-04-29T15:40:00'
        }
      ]
    });
});
