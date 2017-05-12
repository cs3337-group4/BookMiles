// class Controller representing the Controller module
function Controller(output, handlers) {
  console.log("Launching BOSS Calendar Controller");
  this.module = {};
  // create a local instance of a Preferences database
  this.prefs = new Preferences();
  // create a local instance of a Calendar storage (see class calendar.js for more details)
  this.cal = new Calendar();
  this.blst = new BookList();
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

        // todo: remove this as it's no longer used
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
          c.display.render("book_add", {callback:c._callback});
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

          for(var i in config.events)
            c.cal.parseEvent(config.events[i], config.color);

          if (config.currentIndex + 1 == config.total) {
            console.log("Retrieved all calendars");
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
    else if (origin == "BookMan") {
      switch(event) {
        case "addBook":
          var book = c.blst.parseBook(config.book);
          console.log(book);
          c.blst.addBook(book);
          var rdays = addBookEvent(c.cal, book, new Date());
          c.cal.manageEvents(rdays, book);
          c.display.render("calendar", {cal:c.cal, handlers: handlers});
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
});

// todo: separate this into Book Manager, Machine Learning, and Schedule Manager modules
function addBookEvent(cal, book, cstart) {
  console.log("Analyzing and generating reading events");
  // todo: store these inside preferences
  var sleep_time = 8; // how many hours are spent sleeping
  var pace = 15; // how many pages can be read an hour
  var allotment = 10; // how many % of your free time is dedicated to reading

  var cyear = cstart.getFullYear();
  var cmonth = cstart.getMonth();
  var cdate = cstart.getDate();
  var cday = cstart.getDay();

  var events = [];

  for (var i in cal.events) {
    var event = cal.events[i];
    var estart = new Date(event.start);
    var eyear = estart.getFullYear();
    var emonth = estart.getMonth();
    var edate = estart.getDate();

    if(cyear < eyear || (cyear == eyear && cmonth <= emonth && cdate <= edate))
      events.push(event);
  }

  var total = book.pages;
  var days = book.days;
  var temp = days[6];

  for(var i=6; i>0; i--)
    days[i] = days[i-1];
  days[0] = temp;

  var cursor = 0;
  var cdays = [0, 0, 0, 0, 0, 0, 0];
  var ostart = new Date(cstart.getTime());

  var rdays = [];
  var flag = false;

  while(total > 0) {
    cyear = cstart.getFullYear();
    cmonth = cstart.getMonth();
    cdate = cstart.getDate();
    cday = cstart.getDay();
    var sum = 0;

    // if the user has indicated that today is available for reading projects
    //console.log(cday + " is " + days[cday]);
    if(days[cday]) {
      var bhours = sleep_time;

      for(var i in events) {
        var event = events[i];
        var estart = new Date(event.start);
        var eyear = estart.getFullYear();
        var emonth = estart.getMonth();
        var edate = estart.getDate();
        var eend = new Date(event.end);

        if(cyear==eyear && cmonth==emonth && cdate==edate) {
          var bdiff = eend.getTime() - estart.getTime();
          // need error checking for events that go on for longer than a day
          bdiff = bdiff / (60 * 60 * 1000);
          bhours += bdiff;
        }
      }

      var ahours = 24 - bhours;
      if (ahours < 0) ahours = 0;
      sum += ahours;
      cdays[cursor] = ahours;
    }

    cursor++;

    if(cursor == 7) {
      for(var i=0; i<7; i++) {
        var pstart = new Date(ostart.getTime());
        var oyear = ostart.getFullYear();
        var omonth = ostart.getMonth();
        var odate = ostart.getDate();
        pstart.setDate(odate + i);

        if(pstart.getDate() < odate) {
          pstart.setMonth(omonth + 1);
          if(pstart.getMonth() < omonth)
            pstart.setFullYear(oyear + 1);
        }

        var pyear = pstart.getFullYear();
        var pmonth = pstart.getMonth();
        var pdate = pstart.getDate();
        var time = Math.round(cdays[i] * allotment / 10) / 10.0;

        if(time > 0.0)
        rdays.push({
          date: pyear + "-" + (pmonth+1) + "-" + pdate + "T00:00:00",
          time: time,
        });
      }

      flag = true;
      cursor = 0;
      cday = [0, 0, 0, 0, 0, 0, 0];
    }

    cstart.setDate(cdate + 1);
    if(cstart.getDate() < cdate) {
      cstart.setMonth(cmonth + 1);
      if(cstart.getMonth() < cmonth)
        cstart.setFullYear(cyear + 1);
    }

    if(flag) {
      ostart = new Date(cstart.getTime());
      flag = false;
    }

    total -= sum * pace * allotment / 100;
  }

  return rdays;
}