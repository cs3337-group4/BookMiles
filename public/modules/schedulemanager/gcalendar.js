// class GCalSession implements Google Calendar API
function GCalSession(callback) {
  this._callback = callback;
  var gcal = this;
  var timeMin = (new Date()).getFullYear() + "-01-01T00:00:00.000Z";
  console.log("Initializing Google Calendar API");
  gapi.load("client:auth2", function() {
    gapi.client.init({
      // Array of API discovery doc URLs for necessary APIs
      discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
      // Client ID and API key from the Developer Console
      //clientId: '393198699429-7ucpd2a261jmn9copl8pamtabbn6pstj.apps.googleusercontent.com',
      clientId: "858839897629-edojg5ubnua8u1obb7oqi1skou1gculd.apps.googleusercontent.com",
      // Authorization scopes required by the API; multiple scopes can be included, separated by spaces
      scope: "https://www.googleapis.com/auth/calendar"
    }).then(function() {
      gapi.auth2.getAuthInstance().isSignedIn.listen(function() {
        gcal.fetchEvents(timeMin, callback);
      });
      if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
        gcal.fetchEvents(timeMin, callback);
      }
      else {
        console.log("Attempting to sign in to Google Calendar API");
        gapi.auth2.getAuthInstance().signIn();
      }
    });
  });

}

// call this to sign in and authenticate with Google services (it's already automagically done)
GCalSession.prototype.signIn = function(event) {
  gapi.auth2.getAuthInstance().signIn();
}

// call this to sign out and deauthenticate with Google services
GCalSession.prototype.signOut = function(event) {
  gapi.auth2.getAuthInstance().signOut();
}

// function to show the "form" of an object of type "event"
// I'm expecting this type of object in Controller
GCalSession.prototype.createEvent = function(id, title, text, color, startDate, endDate) {
  return {
    id: id,
    title: title,
    text: text,
    backgroundColor: color,
    start: startDate,
    end: endDate
  }
}

// fetches events from Google Calendar, replaces listUpcomingEvents
GCalSession.prototype.fetchEvents = function(timeMin, callback) {
  var gcal = this;

  gapi.client.calendar.calendarList.list().then(function(response) {
    console.log("Received calendarList response");
    var cals = response.result.items;
    var ocals = [];

    for(var i in cals) {
      var cal = cals[i];
      // only access calendars that the user has created
      if (cal.accessRole == "owner") {
        ocals.push({
          id: cal.id,
          name: cal.summary,
          color: cal.backgroundColor
        });
      }
    }

    var total = ocals.length;
    var currentIndex = 0;

    gcal.fetchCalendarsR(gcal, ocals, currentIndex, total, timeMin);
  });
}

// recursively fetch all calendars that are owned by the current GCal user
GCalSession.prototype.fetchCalendarsR = function(gcal, ocals, currentIndex, total, timeMin) {
  var cal = ocals[currentIndex];

  gapi.client.calendar.events.list({
    calendarId: cal.id,
    timeMin: timeMin,
    showDeleted: false,
    singleEvents: true,
    orderBy: "startTime"
  }).then(function(response) {
    gcal._callback("SchedMan", "fetchEvents", {
      currentIndex: currentIndex,
      total: total,
      id: cal.id,
      name: cal.name,
      color: cal.color,
      events: response.result.items
    });

    currentIndex++;

    if (currentIndex < total)
      gcal.fetchCalendarsR(gcal, ocals, currentIndex, total);
  });
}

// add an event to Google Calendar, untested, but should work
GCalSession.prototype.addEvent = function(event) {
  var request = gapi.client.calendar.events.insert({
    calendarId: "primary",
    resource: {
      summary: event.title,
      location: event.location,
      description: event.text,
      start: {
        dateTime: event.startDate
      },
      end: {
        dateTime: event.endDate
      }
    }
  });

  request.execute(function(response) {
    this._callback("SchedMan", "addEvent", {});
  });

}

// delete an event from Google Calendar, untested but should work
GCalSession.prototype.deleteEvent = function(event) {

  var request = gapi.client.calendar.events.delete({
    calendarId: "primary",
    eventId: event.id
  });

  request.execute(function(response) {
    this._callback("SchedMan", "deleteEvent", {});
  });

}
