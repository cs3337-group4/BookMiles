// class Controller representing the Controller module
function Controller(output, handlers) {
  console.log("Launching BOSS Calendar Controller");
  this.module = {};
  // create a local instance of a Preferences database
  this.prefs = new Preferences();
  // create a local instance of a Calendar storage (see class calendar.js for more details)
  this.cal = new Calendar();
  this.handlers = handlers;

  var c = this;

  this._callback = function(origin, event, config) {
    var x = 0;
    var y = 0;

    if (config) {
      x = config.x;
      y = config.y;
    }
    // handling event callbacks from the display
    if (origin == "Display") {
      switch(event) {
        case "clickEvent":
          var e = c.cal.getEvent(config.id);
          console.log(e);
          if (e != null)
            c.display.render("event_edit", {event:e});
          break;

        case "saveEvent":
          var e = c.cal.getEvent(config.id);
          c.cal.editEvent(e.id, config.params);
          c.display.render("calendar", {cal:c.cal, handlers: handlers});
          break;

        case "bookAddEvent":
          var book = output.getElementById("book").value;
          var freq = output.getElementById("freq").value;
          if (!freq || freq == "more than 3 times") freq = 7;
          console.log("Confirm adding " + book + " at " + freq);
          for (var i=0; i<freq; i++)
            addBookEvent(c.cal, "Read \"" + book + "\"");
          c.display.render("calendar", {cal:c.cal, handlers: handlers});
          break;

        case "saveSettings":
          c.display.render("calendar", {cal:c.cal, handlers: handlers});
          break;

        case "displayTable":
          c.display.render("calendar", {cal:c.cal, handlers: handlers});
          break;

        case "addProject":
          c.display.render("book_add", {});
          break;

        case "displayProgress":
          c.display.render("history", {});
          break;

        case "displaySettings":
          c.display.render("settings", c.prefs.appconfig);
          break;
      }
    }
    else if (origin == "SchedMan") {
      switch(event) {
        case "fetchEvents":
          console.log("Fetched events from calendar " + config.name);
          console.log("Number " + (config.currentIndex+1) + " of " + config.total);
          console.log("Id: " + config.id);
          console.log("Color: " + config.color);

          for(var i in config.events)
            c.cal.parseEvent(config.events[i], config.color);

          if (config.currentIndex + 1 == config.total) {
            console.log("Retrieved all calendars, displaying...")
            c.display.render("calendar", {cal:c.cal, handlers: c.handlers});
          }
          break;
        case "addEvent":
          console.log("Successfully added event into Google Calendar");
          break;
        case "deleteEvent":
          console.log("Successfully deleted event from Google Calendar");
          break;
      }
    }
  }

  this.display = new DisplayHTML(output, handlers, this._callback);
  this.gcal = new GCalSession(this._callback);
}

Controller.prototype.execute = function() {
  
  this.display.render("calendar", {cal:this.cal, handlers: this.handlers});
}

$(document).ready(function() {
  this.handlers = {};
  var c = new Controller(document, this.handlers);
  //c.execute();
});

// todo: separate this into Book Manager, Machine Learning, and Schedule Manager modules
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