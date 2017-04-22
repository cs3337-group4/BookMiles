/*
 * Original Chapter 6 codes
 *
 */

function TextCell(text) {
  this.text = text.split("\n");
}

TextCell.prototype.minWidth = function() {
  return this.text.reduce(function(width, line) {
    return Math.max(width, line.length);
  }, 0);
};

TextCell.prototype.minHeight = function() {
  return this.text.length;
};

TextCell.prototype.draw = function(width, height) {
  var result = [];
  for (var i=0; i<height; i++) {
    var line = this.text[i] || "";
    result.push(line + repeat(" ", width - line.length));
  }
  return result;
};

// repeat doesn't seem to be a built-in function, so I'm adding an alternative here
function repeat(text, n) {
  if (n<=0) return "";
  return text.repeat(n);
}

function rowHeights(rows) {
  return rows.map(function(row) {
    return row.reduce(function(max, cell) {
      return Math.max(max, cell.minHeight());
    }, 0);
  });
}

function colWidths(rows) {
  return rows[0].map(function(_, i) {
    return rows.reduce(function(max, row) {
      return Math.max(max, row[i].minWidth());
    }, 0);
  });
}

function outputHTML(text_a) {
  if (text_a.length == 0) return "";
  var r = "<p>";
  for (var i in text_a) {
    r += text_a[i] + "<br/>";
  }
  return r + "</p>";
}

function outputCell(text, x, y, flag) {
  var r = "    <div onclick=\"clickEvent(" + x + "," + y + ")\""
        + " class=\"div-cell " + (flag ? "div-clickable" : "") + "\">" + text + "</div>\n";
  return r;
}

function outputTable(rows) {
  var doc, row;
  var heights = rowHeights(rows);
  var widths = colWidths(rows);

  if (document.body != null)
    document.body.innerHTML = "";
  doc = "<h4 style=\"font-family: sans-serif\">Schedule <small>(updated 03/25/2017)</small></h4>\n\n"
      + "<div class=\"div-table\" style=\"font-family:sans serif;"
      + " font-size:12; border:1px solid black; border-collapse:collapse;\">\n";

  rows.map(function(r, r_i) {
    row = "  <div class=\"div-row\">\n";
    r.map(function(c, c_i) {
      var text_a = c.draw(widths[c_i], heights[r_i]);
      row += outputCell(outputHTML(text_a), c_i, r_i);
    });
    row += "  </div>\n";
    doc += row;
  });
  doc += "</div>\n"
       + "<br/>\n"
       + "<input type=\"button\" class=\"btn btn-warning\" onclick=\"addProject()\" value=\"Add Book\">\n"
       + "<input type=\"button\" class=\"btn btn-info\" onclick=\"displaySettings()\" value=\"Settings\">\n";
  document.body.innerHTML = doc;

  return doc;
};

function arrayToCells(array) {
  return array.map(function(row) {
    return row.map(function(cell) {
      return new TextCell(cell);
    });
  });
}

function displayTable() {
  outputTable(arrayToCells(cal.draw()));
}

function displayEvent(cell, x, y) {
  var t = cal.getTime(y-1);
  var d = cal.getDay(x);

  doc = "<h4 style=\"font-family:sans-serif\">" + d + " @ " + t + "</h4>\n\n"
      + "<form>\n"
      + "  <div class=\"form-group\">\n"
      + "    <label for=\"user\">Event Name</label>\n"
      + "    <input type=\"text\" class=\"form-control\" id=\"event\" value=\"" + cell + "\">\n"
      + "  </div>\n"
      + "  <div class=\"form-check\">\n"
      + "    <label class=\"form-check-label\">"
      + "      <input type=\"checkbox\" class=\"form-check-input\" name=\"options\" id=\"opt1\" value=\"opt1\">"
      + "      Set as Busy\n"
      + "    </label>\n"
      + "  </div>\n";

  if (cell.includes("Read")) {
    doc += "  <div class=\"form-group\">\n"
        +  "    <label for=\"sel1\">Make a reading progress report:</label>\n"
        +  "    <select class=\"form-control\" id=\"sel1\">\n"
        +  "      <option>10 pages</option>\n"
        +  "      <option>20 pages</option>\n"
        +  "      <option>30 pages</option>\n"
        +  "      <option>More than 30 pages</option>\n"
        +  "      <option>I skipped this session</option>\n"
        +  "    </select>\n"
        +  "  </div>\n";
  }

  doc += "  <input type=\"button\" class=\"btn btn-warning\" onclick=\"saveEvent(" + x + ", " + y + ")\" value=\"Save\">\n"
      +  "  <input type=\"button\" class=\"btn btn-success\" onclick=\"displayTable()\" value=\"Cancel\">\n"
      +  "</form>\n"
  document.body.innerHTML = doc;

  return doc;
}

function displaySettings() {
  doc = "<h4 style=\"font-family:sans-serif\">Settings</h4>\n\n"
      + "<form>\n"
      + "  <fieldset class=\"form-group\">\n"
      + "    <div class=\"form-check\">\n"
      + "      <label class=\"form-check-label\">"
      + "        <input type=\"checkbox\" class=\"form-check-input\" name=\"options\" id=\"opt1\" value=\"option1\">"
      + "        Allow the app to send diagnostic data to CS3337 Group 4\n"
      + "      </label>\n"
      + "    </div>\n"
      + "    <div class=\"form-check\">\n"
      + "      <label class=\"form-check-label\">"
      + "        <input type=\"checkbox\" class=\"form-check-input\" name=\"options\" id=\"opt2\" value=\"option2\" disabled>"
      + "        Offline Mode (not implemented yet)\n"
      + "      </label>\n"
      + "    </div>\n"
      + "    <div class=\"form-check\">\n"
      + "      <label class=\"form-check-label\">"
      + "        <input type=\"checkbox\" class=\"form-check-input\" name=\"options\" id=\"opt3\" value=\"option3\">"
      + "        Use graphics hardware acceleration (prototyping)\n"
      + "      </label>\n"
      + "    </div>\n"
      + "    <div class=\"form-check\">\n"
      + "      <label class=\"form-check-label\">"
      + "        <input type=\"checkbox\" class=\"form-check-input\" name=\"options\" id=\"opt4\" value=\"option4\" checked>"
      + "        Ask user about their progress on startup\n"
      + "      </label>\n"
      + "    </div>\n"
      + "    <div class=\"form-check\">\n"
      + "      <label class=\"form-check-label\">"
      + "        <input type=\"checkbox\" class=\"form-check-input\" name=\"options\" id=\"opt5\" value=\"option5\" checked>"
      + "        Automatically check for updates\n"
      + "      </label>\n"
      + "    </div>\n"
      + "  </fieldset>\n"
      + "  <input type=\"button\" class=\"btn btn-info\" onclick=\"displayTable()\" value=\"Save\">\n"
      + "  <input type=\"button\" class=\"btn btn-success\" onclick=\"displayTable()\" value=\"Cancel\">\n"
      + "</form>\n"
  document.body.innerHTML = doc;

  return doc;
}

function addProject() {
  doc = "<h4 style=\"font-family:sans-serif\">Reading Project</h4>\n\n"
      + "<form>\n"
      + "  <div class=\"form-group\">\n"
      + "    <label for=\"user\">Book name (or ISBN)</label>\n"
      + "    <input type=\"text\" class=\"form-control\" id=\"book\" placeholder=\"Type in your book's name or ISBN\">\n"
      + "  </div>\n"
      + "  <div class=\"form-group\"\n"
      + "    <label for=\"freq\">How many times would you like to read this book per week?</label>\n"
      + "    <select multiple class=\"form-control\" id=\"freq\">\n"
      + "      <option>1</option>\n"
      + "      <option>2</option>\n"
      + "      <option>3</option>\n"
      + "      <option>more than 3 times</option>\n"
      + "    </select>"
      + "  </div>\n"
      + "  <fieldset class=\"form-group\">\n"
      + "    <label>What days of the week would you like to spend on this book? (check all that applies)</label>\n"
      + "    <div class=\"form-check\">\n"
      + "      <label class=\"form-check-label\">"
      + "        <input type=\"radio\" class=\"form-check-input\" name=\"opt1\" id=\"opt1\" value=\"option1\" checked>"
      + "        Monday\n"
      + "      </label>\n"
      + "    </div>\n"
      + "    <div class=\"form-check\">\n"
      + "      <label class=\"form-check-label\">"
      + "        <input type=\"radio\" class=\"form-check-input\" name=\"opt2\" id=\"opt2\" value=\"option2\" checked>"
      + "        Tuesday\n"
      + "      </label>\n"
      + "    </div>\n"
      + "    <div class=\"form-check\">\n"
      + "      <label class=\"form-check-label\">"
      + "        <input type=\"radio\" class=\"form-check-input\" name=\"opt3\" id=\"opt3\" value=\"option3\" checked>"
      + "        Wednesday\n"
      + "      </label>\n"
      + "    </div>\n"
      + "    <div class=\"form-check\">\n"
      + "      <label class=\"form-check-label\">"
      + "        <input type=\"radio\" class=\"form-check-input\" name=\"opt4\" id=\"opt4\" value=\"option4\" checked>"
      + "        Thursday\n"
      + "      </label>\n"
      + "    </div>\n"
      + "    <div class=\"form-check\">\n"
      + "      <label class=\"form-check-label\">"
      + "        <input type=\"radio\" class=\"form-check-input\" name=\"opt5\" id=\"opt5\" value=\"option5\" checked>"
      + "        Friday\n"
      + "      </label>\n"
      + "    </div>\n"
      + "    <div class=\"form-check\">\n"
      + "      <label class=\"form-check-label\">"
      + "        <input type=\"radio\" class=\"form-check-input\" name=\"opt6\" id=\"opt6\" value=\"option6\" checked>"
      + "        Saturday\n"
      + "      </label>\n"
      + "    </div>\n"
      + "    <div class=\"form-check\">\n"
      + "      <label class=\"form-check-label\">"
      + "        <input type=\"radio\" class=\"form-check-input\" name=\"opt7\" id=\"opt7\" value=\"option7\" checked>"
      + "        Sunday\n"
      + "      </label>\n"
      + "    </div>\n"
      + "  </fieldset>\n"
      + "  <input type=\"button\" class=\"btn btn-warning\" onclick=\"confirmProject()\" value=\"Add Book\">\n"
      + "  <input type=\"button\" class=\"btn btn-success\" onclick=\"displayTable()\" value=\"Cancel\">\n"
      + "</form>\n"
  document.body.innerHTML = doc;

  return doc;
}

function confirmProject() {
  // implement calendar codes here
  var book = document.getElementById("book").value;
  var freq = document.getElementById("freq").value;
  if (!freq || freq == "more than 3 times") freq = 7;
  console.log("Confirm adding " + book + " at " + freq);
  for (var i=0; i<freq; i++)
    addBookEvent("Read \"" + book + "\"");
  displayTable();
}

// todo: turn this into some kinda algorithm
function addBookEvent(book) {
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

function clickEvent(x, y) {
  var t = cal.getTime(y-1);
  var d = cal.getDay(x);
  var e = cal.getEvent(d, t);
  console.log("clicked on (" + x + "," + y + "): " + e);
  displayEvent(e, x, y);
}

function saveEvent(x, y) {
  var t = cal.getTime(y-1);
  var d = cal.getDay(x);
  var e = document.getElementById("event").value;
  cal.addEvent(e, d, t);
  displayTable();
}

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
  return this.calendar[t][d];
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

// because I'm lazy!
var cal = new Calendar();

$(document).ready(function() {
  cal.addEvent("BIOL1010", "Monday", "4:00PM");
  cal.addEvent("BIOL1010", "Monday", "6:00PM");
  cal.addEvent("CS3035", "Tuesday", "8:00AM");
  cal.addEvent("CS3035", "Tuesday", "10:00AM");
  cal.addEvent("CS3186", "Tuesday", "6:00PM");
  cal.addEvent("BIOL1010", "Wednesday", "6:00PM");
  cal.addEvent("CS3035", "Thursday", "8:00AM");
  cal.addEvent("CS3035", "Thursday", "10:00AM");
  cal.addEvent("CS3186", "Thursday", "6:00PM");
  cal.addEvent("CS3801", "Friday", "4:00PM");
  cal.addEvent("CS3801", "Friday", "6:00PM");
  cal.addEvent("CS3337", "Saturday", "10:00AM");
  cal.addEvent("CS3337", "Saturday", "12:00PM");
  cal.addEvent("CS3337", "Saturday", "2:00PM");
  displayTable();
});