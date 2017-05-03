function displayTable(output, config) {
  var doc;
  doc = "<div style='max-width: 900px; margin: 0px auto'>"
      + "  <div id='calendar'></div>\n"
      + "  <br/>\n"
      + "  <input type=\"button\" class=\"btn btn-warning\" onclick=\"handlers.addProject()\" value=\"Add Book\">\n"
      + "  <input type=\"button\" class=\"btn btn-danger\" onclick=\"\" value=\"Display Progress\">\n"
      + "  <input type=\"button\" class=\"btn btn-info\" onclick=\"handlers.displaySettings()\" value=\"Settings\">\n";
      + "</div>\n"
  //output.body.innerHTML = "<div id='calendar'></div>\n";
  output.body.innerHTML = doc;
  
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
    events: config.cal.events,
    eventClick: function(event, jsEvent, view) {
      console.log("Clicked on: " + event.title + " [" + event.id + "]");
      console.log(this);
      console.log(window.parent);
      window.handlers.clickEvent(jsEvent.pageX, jsEvent.pageY);
    }
  });

  return doc;
}

function displayEvent(output, config) {
  var x = config.x;
  var y = config.y;
  var cell = config.e;
  var t = config.cal.getTime(y-1);
  var d = config.cal.getDay(x);

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

  doc += "  <input type=\"button\" class=\"btn btn-warning\" onclick=\"handlers.saveEvent(" + x + ", " + y + ")\" value=\"Save\">\n"
      +  "  <input type=\"button\" class=\"btn btn-success\" onclick=\"handlers.displayTable()\" value=\"Cancel\">\n"
      +  "</form>\n"
  output.body.innerHTML = doc;

  return doc;
}

function displaySettings(output, config) {
  doc = "<h4 style=\"font-family:sans-serif\">Settings</h4>\n\n"
      + "<form>\n"
      + "  <fieldset class=\"form-group\">\n";

  for(var i=0; i<config.length; i++) {
    var item = config[i];
    doc += "    <div class=\"form-check\">\n"
        +  "      <label class=\"form-check-label\">"
        +  "        <input type=\"checkbox\" class=\"form-check-input\" name=\"options\" id=\"" + item.id + "\" value=\"" + item.value + "\"" + (item.checked ? " checked" : "") + ">"
        +  "        " + item.text + "\n"
        +  "      </label>\n"
        +  "    </div>\n";
  }

  doc += "  </fieldset>\n"
      +  "  <input type=\"button\" class=\"btn btn-info\" onclick=\"handlers.displayTable()\" value=\"Save\">\n"
      +  "  <input type=\"button\" class=\"btn btn-success\" onclick=\"handlers.displayTable()\" value=\"Cancel\">\n"
      +  "</form>\n";

  output.body.innerHTML = doc;
}

function addProject(output) {
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
      + "  <input type=\"button\" class=\"btn btn-warning\" onclick=\"handlers.confirmProject()\" value=\"Add Book\">\n"
      + "  <input type=\"button\" class=\"btn btn-success\" onclick=\"handlers.displayTable()\" value=\"Cancel\">\n"
      + "</form>\n"
  output.body.innerHTML = doc;
}

function DisplayHTML(output, handlers, callback) {
  this._output = output;
  this._handlers = handlers;

  // setting up necessary handlers for the views here
  handlers.clickEvent = function(x, y) {
    callback("ClickEvent", {x:x, y:y});
  }

  handlers.saveEvent = function(x, y) {
    callback("SaveEvent", {x:x, y:y});
  }

  handlers.confirmProject = function() {
    callback("BookAddEvent", null);
  }

  handlers.displayTable = function() {
    callback("DisplayTable", null);
  }

  handlers.addProject = function() {
    callback("AddProject", null);
  }

  handlers.displaySettings = function() {
    callback("DisplaySettings", null);
  }
}

DisplayHTML.prototype.render = function(page, config) {
  this.currentPage = page;
  switch(page) {
    case "calendar":
      displayTable(this._output, config);
      break;
    case "book_add":
      addProject(this._output);
      break;
    case "event_edit":
      displayEvent(this._output, config);
      break;
    case "settings":
      displaySettings(this._output, config);
      break;
  }
}
