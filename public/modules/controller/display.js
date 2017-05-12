function displayTable(output, config) {
  var doc;
  doc = "<div style='max-width: 900px; margin: 0px auto'>"
      + "  <div id='calendar'></div>\n"
      + "  <br/>\n"
      + "  <input type=\"button\" class=\"btn btn-warning\" onclick=\"handlers.addProject()\" value=\"Add Book\">\n"
      + "  <input type=\"button\" class=\"btn btn-danger\" onclick=\"handlers.displayHistory()\" value=\"Display Progress\">\n"
      + "  <input type=\"button\" class=\"btn btn-info\" onclick=\"handlers.displaySettings()\" value=\"Settings\">\n";
      + "</div>\n"
  output.body.innerHTML = doc;

  $('#calendar').fullCalendar({
    header: {
      left: 'prev,next today',
      center: 'title',
      right: 'agendaDay,agendaWeek,month'
    },
    defaultView: 'agendaWeek',
    defaultDate: (new Date()).toISOString(),
    navLinks: true, // can click day/week names to navigate views
    editable: false,
    eventLimit: true, // allow "more" link when too many events
    events: config.cal.events,
    eventClick: function(event, jsEvent, view) {
      config.handlers.clickEvent(event.id);
    },
    dayClick: function(date, allDay, jsEvent, view) {
      if (!view || view.name != "agendaDay") {
        $('#calendar').fullCalendar("gotoDate", date);
        $('#calendar').fullCalendar("changeView", "agendaDay");
      }
    }
  });

  return doc;
}

function displayEvent(output, config) {
  var e = config.event;

  function to12H(date) {
    var h = parseInt(date.substring(11,13));
    var m = date.substring(14,16);
    var a = h > 12 ? "PM" : "AM";
    h = h > 12 ? h - 12 : h;

    return ((h < 10 ? "0" + h : h) + ":" + m + a);
  }

  doc = "<h4 style=\"font-weight:bold\">" + e.start.substring(0, 10) + "</h4>\n\n"
      + "<form>\n"
      /*
      + "  <div class=\"form-group\">\n"
      + "    <label for=\"title\">Event Name</label>\n"
      + "    <input type=\"text\" class=\"form-control\" id=\"title\" value=\"" + e.title + "\">\n"
      + "  </div>\n"
      + "  <div class=\"form-group\">\n"
      + "    <label for=\"text\">Event Description</label>\n"
      + "    <input type=\"text\" class=\"form-control\" id=\"text\" value=\"" + e.text + "\">\n"
      + "  </div>\n"
      */
      + "  <label style=\"font-weight:bold\">Title:</label><span> " + e.title + "</span>\n"
      + "  <br/>"
      + "  <label style=\"font-weight:bold\">Description:</label><span> " + e.text + "</span>\n"
      + "  <br/>"
      + "  <label style=\"font-weight:bold\">Start time:</label><span> " + to12H(e.start) + "</span>\n"
      + "  <br/>"
      + "  <label style=\"font-weight:bold\">End time:</label><span> " + to12H(e.end) + "</span>\n"
      + "  <br/>"
      /*
      + "  <div class=\"form-check\">\n"
      + "    <label class=\"form-check-label\">"
      + "      <input type=\"checkbox\" class=\"form-check-input\" name=\"options\" id=\"opt1\" value=\"opt1\">"
      + "      Set as Busy\n"
      + "    </label>\n"
      + "  </div>\n";
      */

  if (e.title.includes("Read")) {
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

  doc += (!e.readonly ? "  <input type=\"button\" class=\"btn btn-warning\" onclick=\"handlers.saveEvent(" + e.id + ")\" value=\"Save\">\n" : "")
      +  "  <input type=\"button\" class=\"btn btn-success\" onclick=\"handlers.displayTable()\" value=\"Back\">\n"
      +  "</form>\n"
  output.body.innerHTML = doc;

  return doc;
}

function displaySettings(output, config) {
  doc = "<div style=\"max-width:900px; margin:auto\">\n"
      + "  <h4 style=\"font-family:sans-serif\">Settings</h4>\n\n"
      + "  <div class=\"form-horizontal\">"
      + "    <div class=\"form-group\">\n"
      + "      <label class=\"control-label\" for=\"sleepStart\">Sleep Start:</label>\n"
      + "      <div class=\"col-sm-10\">\n"
      + "        <input class=\"form-control\" type=\"text\" id=\"sleepStart\" placeholder=\"10:00PM\">\n"
      + "      </div>\n"
      + "    </div>\n"
      + "    <div class=\"form-group\">\n"
      + "      <label class=\"control-label\" for=\"sleepEnd\">Sleep End:</label>\n"
      + "      <div class=\"col-sm-10\">\n"
      + "        <input class=\"form-control\" type=\"text\" id=\"sleepEnd\" placeholder=\"6:00AM\">\n"
      + "      </div>\n"
      + "    </div>\n"
      + "    <div class=\"form-group\">\n"
      + "      <label class=\"control-label\" for=\"pace\">Reading Pace (pages per hour):</label>\n"
      + "      <div class=\"col-sm-10\">\n"
      + "        <input class=\"form-control\" type=\"text\" id=\"pace\" placeholder=\"15\">\n"
      + "      </div>\n"
      + "    </div>\n"
      + "    <div class=\"form-group\">\n"
      + "      <label class=\"control-label\" for=\"allotment\">Allocation (%):</label>\n"
      + "      <div class=\"col-sm-10\">\n"
      + "        <input class=\"form-control\" type=\"text\" id=\"allotment\" placeholder=\"10%\">\n"
      + "      </div>\n"
      + "    </div>\n"
      + "  </div>\n"
      + "  <br>\n"
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
      +  "  <input type=\"button\" class=\"btn btn-success\" onclick=\"handlers.displayTable()\" value=\"Back\">\n"
      +  "</form>\n";

  output.body.innerHTML = doc;
}

function addProject(output, config) {
  doc = "<div style=\"max-width:900px; margin:auto\">\n"
      + "  <h4 style=\"font-family:sans-serif\">Add A Reading Project</h4>\n\n"
      + "  <div id=\"book-view\">\n"
      + "    <div class=\"form-group\">\n"
      + "      <label for=\"user\">Book name (or ISBN without dashes)</label>\n"
      + "      <input type=\"text\" class=\"form-control\" id=\"book\" placeholder=\"Type in your book's name or ISBN\">\n"
      + "    </div>\n"
      + "    <div id=\"book-titles\"></div>\n"
      + "  </div>\n"
      + "  <div id=\"controls\">\n"
      //+ "    <input type=\"button\" class=\"btn btn-warning\" onclick=\"handlers.confirmProject()\" value=\"Add Book\">\n"
      + "    <input type=\"button\" class=\"btn btn-success\" onclick=\"handlers.displayTable()\" value=\"Back\">\n"
      + "  </div>"
      + "</div>\n"
  output.body.innerHTML = doc;

  var timer = null;

  document.getElementById("book").addEventListener("input", function(event) {
    var text = event.target.value;

    if (timer != null)
      window.clearTimeout(timer);
    timer = setTimeout(function() {
      var googleAPI = "https://www.googleapis.com/books/v1/volumes?q=" + text;

      $.ajax({
        dataType: "json",
        url: googleAPI,
        dataType: 'json',
        async: false,
      }).done(function( data ) {
        var items = data.items;
        var space_doc = "<div class=\"list-group\">\n"

        for(var i in items) {
          var vol = items[i].volumeInfo;
          //console.log(vol);
          var img = vol.imageLinks.smallThumbnail;
          var title = items[i].volumeInfo.title;
          space_doc += "<div id=\"book_" + i + "\" class=\"list-group-item div-clickable\" style=\"height:130px; -moz-user-select:none; -webkit-user-select:none; user-select:none\">\n"
                    +  "  <img src=\"" + img + "\" alt=\"cover\" width=\"12%\" style=\"padding:10px; pointer-events:none;\"></img>\n"
                    +  "  <div style=\"display:inline-block; pointer-events:none\">\n"
                    +  "    <span style=\"font-weight:bold\">" + title + "</span><br/>\n"
                    +  "    Author: " + (vol.authors ? vol.authors[0] : "Unknown") + "<br/>\n"
                    +  "    Published: " + vol.publishedDate + "<br/>\n"
                    +  "    Page Count: " + vol.pageCount + "\n"
                    +  "  </div>\n"
                    +  "</div>\n";
        }
        space_doc += "</div><br>\n";

        var space = document.createElement("div");
        space.id = "space";
        space.innerHTML = space_doc;
        var old_space = document.getElementById("space");
        if(old_space)
          document.getElementById("book-titles").removeChild(old_space);
        document.getElementById("book-titles").appendChild(space);

        for(var i in items) {
          document.getElementById("book_" + i).addEventListener("click", function(event) {
            console.log("clicked on " + event.target.id);
            var vol = items[parseInt(event.target.id.substring(5, event.target.id.length))].volumeInfo;
            var book_doc = "<div style=\"max-width:900px\">"
                         + "  <div style=\"width:25%; display:inline-block; padding:10px; pointer-events:none;\">"
                         + "    <img src=\"" + vol.imageLinks.thumbnail + "\" alt=\"cover\" width=\"100%\"></img>\n"
                         + "  </div>"
                         + "  <div style=\"display:inline-block; vertical-align:middle; pointer-events:none\">\n"
                         + "    <span style=\"font-weight:bold\">" + vol.title + "</span><br/>\n"
                         + "    ISBN: " + vol.industryIdentifiers[0].identifier + "<br/>\n"
                         + "    Author: " + (vol.authors ? vol.authors[0] : "Unknown") + "<br/>\n"
                         + "    Publisher: " + vol.publisher + "<br/>\n"
                         + "    Published: " + vol.publishedDate + "<br/>\n"
                         + "    Page Count: " + vol.pageCount + "<br/><br/>\n"
                         + "  </div>\n"
                         + "</div>\n"
                         + "<span>" + vol.description + "</span><br/><br/>\n";
            var controls = "<fieldset class=\"form-group\">\n"
                         + "  <label>What days of the week would you like to spend on this book? (check all that applies)</label>\n";

            var days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

            for(var i=1; i<8; i++) {
              controls += "  <div class=\"form-check\">\n"
                       +  "    <label class=\"form-check-label\">"
                       +  "      <input type=\"checkbox\" class=\"form-check-input\" name=\"opt" + i + "\" id=\"opt" + i + "\" checked>"
                       +  "      " + days[i-1] + "\n"
                       +  "    </label>\n"
                       +  "  </div>\n";
            }

            controls += "</fieldset>\n"
                     +  "<input type=\"button\" class=\"btn btn-warning\" id=\"addbtn\" value=\"Add\">\n"
                     +  "<input type=\"button\" class=\"btn btn-danger\" onclick=\"handlers.addProject()\" value=\"Reset\">\n"
                     +  "<input type=\"button\" class=\"btn btn-success\" onclick=\"handlers.displayTable()\" value=\"Back\">\n"

            document.getElementById("book-view").innerHTML = book_doc;
            document.getElementById("controls").innerHTML = controls;

            document.getElementById("addbtn").addEventListener("click", function(event) {
              console.log("clicked on add btn");
              console.log(config);
              var days = [];
              for(var i=1; i<8; i++) {
                var opt = document.getElementById("opt" + i);
                days.push(opt.checked);
              }
              vol.days = days;
              config.callback("BookMan", "addBook", {book: vol});
            });
          });
        }
      });
    }, 500);
  });
}

function displayHistory(output, config) {
  var doc = "<div style='max-width: 900px; margin: 0px auto'>"
          + "  <div id=\"canvas-container\"></div>\n"
          + "  <br>\n"
          + "  <br>\n"
          + "  <button class=\"btn btn-danger\" id=\"dayView\">Daily View</button>\n"
          + "  <button class=\"btn btn-warning\" id=\"weekView\">Weekly View</button>\n"
          + "  <button class=\"btn btn-primary\" id=\"monthView\">Monthly View</button>\n"
          + "  <input type=\"button\" class=\"btn btn-success\" onclick=\"handlers.displayTable()\" value=\"Back\">\n"
          + "</div>\n"
  output.body.innerHTML = doc;

  function randomScalingFactor() {
    return (Math.random() > 0.5 ? 1.0 : -1.0) * Math.round(Math.random() * 100);
  }

  function randomBook() {
    var books = [
      "Harry Potter",
      "The Lord of the Ring",
      "Fifty Shades of Grey",
      "The Unspoken Rule",
      "How To Make Friends",
      "The Quiet American"
    ];

    return books[Math.round(Math.random() * (books.length-1))];
  }

  var config = {
    type: 'line',
    data: {
      labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September"],
      datasets: [{
        label: randomBook(),
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)',
        data: [
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor()
        ],
        fill: false,
      }, {
        label: randomBook(),
        fill: false,
        backgroundColor: 'rgb(54, 162, 235)',
        borderColor: 'rgb(54, 162, 235)',
        data: [
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor()
        ],
      }]
    },
    options: {
      responsive: true,
      title:{
        display:true,
        text:'Your Reading Projects'
      },
      tooltips: {
        mode: 'index',
        intersect: false,
      },
      hover: {
        mode: 'nearest',
        intersect: true
      },
      scales: {
        xAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Month'
          }
        }],
        yAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Pages Read'
          }
        }]
      }
    }
  };

  var canvas = document.createElement("canvas");
  canvas.id = "canvas";
  document.getElementById("canvas-container").appendChild(canvas);
  var ctx = document.getElementById("canvas").getContext("2d");
  window.myLine = new Chart(ctx, config);

  document.getElementById('dayView').addEventListener('click', function() {
    config = {
      type: 'line',
      data: {
        labels: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        datasets: [{
          label: randomBook(),
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'rgb(255, 99, 132)',
          data: [
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor()
          ],
          fill: false,
        }, {
          label: randomBook(),
          fill: false,
          backgroundColor: 'rgb(54, 162, 235)',
          borderColor: 'rgb(54, 162, 235)',
          data: [
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor()
          ],
        }]
      },
      options: {
        responsive: true,
        title:{
          display:true,
          text:'Your Reading Projects'
        },
        tooltips: {
          mode: 'index',
          intersect: false,
        },
        hover: {
          mode: 'nearest',
          intersect: true
        },
        scales: {
          xAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Day'
            }
          }],
          yAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Pages Read'
            }
          }]
        }
      }
    };

    document.getElementById("canvas-container").removeChild(canvas);
    canvas = document.createElement("canvas");
    canvas.id = "canvas";
    document.getElementById("canvas-container").appendChild(canvas);
    ctx = document.getElementById("canvas").getContext("2d");
    window.myLine = new Chart(ctx, config);
  });

  document.getElementById('weekView').addEventListener('click', function() {
    config = {
      type: 'line',
      data: {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6", "Week 7"],
        datasets: [{
          label: randomBook(),
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'rgb(255, 99, 132)',
          data: [
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor()
          ],
          fill: false,
        }, {
          label: randomBook(),
          fill: false,
          backgroundColor: 'rgb(54, 162, 235)',
          borderColor: 'rgb(54, 162, 235)',
          data: [
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor()
          ],
        }]
      },
      options: {
        responsive: true,
        title:{
          display:true,
          text:'Your Reading Projects'
        },
        tooltips: {
          mode: 'index',
          intersect: false,
        },
        hover: {
          mode: 'nearest',
          intersect: true
        },
        scales: {
          xAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Week'
            }
          }],
          yAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Pages Read'
            }
          }]
        }
      }
    };

    document.getElementById("canvas-container").removeChild(canvas);
    canvas = document.createElement("canvas");
    canvas.id = "canvas";
    document.getElementById("canvas-container").appendChild(canvas);
    ctx = document.getElementById("canvas").getContext("2d");
    window.myLine = new Chart(ctx, config);
  });

  document.getElementById('monthView').addEventListener('click', function() {
    var config = {
      type: 'line',
      data: {
        labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September"],
        datasets: [{
          label: randomBook(),
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'rgb(255, 99, 132)',
          data: [
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor()
          ],
          fill: false,
        }, {
          label: randomBook(),
          fill: false,
          backgroundColor: 'rgb(54, 162, 235)',
          borderColor: 'rgb(54, 162, 235)',
          data: [
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor()
          ],
        }]
      },
      options: {
        responsive: true,
        title:{
          display:true,
          text:'Your Reading Projects'
        },
        tooltips: {
          mode: 'index',
          intersect: false,
        },
        hover: {
          mode: 'nearest',
          intersect: true
        },
        scales: {
          xAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Month'
            }
          }],
          yAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Pages Read'
            }
          }]
        }
      }
    };

    document.getElementById("canvas-container").removeChild(canvas);
    canvas = document.createElement("canvas");
    canvas.id = "canvas";
    document.getElementById("canvas-container").appendChild(canvas);
    ctx = document.getElementById("canvas").getContext("2d");
    window.myLine = new Chart(ctx, config);
  });

  /*
  document.getElementById('randomizeData').addEventListener('click', function() {
    config.data.datasets.forEach(function(dataset) {
      dataset.data = dataset.data.map(function() {
        return randomScalingFactor();
      });
    });

    window.myLine.update();
  });

  var colorNames = Object.keys(window.chartColors);
  document.getElementById('addDataset').addEventListener('click', function() {
    var colorName = colorNames[config.data.datasets.length % colorNames.length];
    var newColor = window.chartColors[colorName];
    var newDataset = {
      label: 'Dataset ' + config.data.datasets.length,
      backgroundColor: newColor,
      borderColor: newColor,
      data: [],
      fill: false
    };

    for (var index = 0; index < config.data.labels.length; ++index) {
      newDataset.data.push(randomScalingFactor());
    }

    config.data.datasets.push(newDataset);
    window.myLine.update();
  });

  document.getElementById('addData').addEventListener('click', function() {
    if (config.data.datasets.length > 0) {
      var month = MONTHS[config.data.labels.length % MONTHS.length];
      config.data.labels.push(month);

      config.data.datasets.forEach(function(dataset) {
        dataset.data.push(randomScalingFactor());
      });

      window.myLine.update();
    }
  });

  document.getElementById('removeDataset').addEventListener('click', function() {
    config.data.datasets.splice(0, 1);
    window.myLine.update();
  });

  document.getElementById('removeData').addEventListener('click', function() {
    config.data.labels.splice(-1, 1); // remove the label first

    config.data.datasets.forEach(function(dataset, datasetIndex) {
      dataset.data.pop();
    });

    window.myLine.update();
  });
  */
}

function DisplayHTML(output, handlers, callback) {
  this._output = output;
  this._handlers = handlers;

  var doc;
  doc = "<div style=\"max-width:800px; margin:auto\">\n"
      + "  <h2 style=\"text-align:center\">Loading Google Calendar Events</h2>\n"
      + "  <br/>"
      + "  <img style=\"margin:auto\" src=\"" + window.location.href + "/assets/calendar-flip.gif\" alt=\"CALENDAR\" width=\"800\" height=\"600\">"
      + "</div>\n"
      
  output.body.innerHTML = doc;

  // setting up necessary handlers for the views here
  handlers.clickEvent = function(id) {
    callback("Display", "clickEvent", {id:id});
  }

  handlers.saveEvent = function(id) {
    callback("Display", "saveEvent", {id:id});
  }

  handlers.displayTable = function() {
    callback("Display", "displayTable", null);
  }

  handlers.addProject = function() {
    callback("Display", "addProject", null);
  }

  handlers.displayHistory = function() {
    callback("Display", "displayProgress", null);
  }

  handlers.displaySettings = function() {
    callback("Display", "displaySettings", null);
  }
}

DisplayHTML.prototype.render = function(page, config) {
  this.currentPage = page;
  switch(page) {
    case "calendar":
      displayTable(this._output, config);
      break;
    case "book_add":
      addProject(this._output, config);
      break;
    case "event_edit":
      displayEvent(this._output, config);
      break;
    case "history":
      displayHistory(this._output, config);
      break;
    case "settings":
      displaySettings(this._output, config);
      break;
  }
}
