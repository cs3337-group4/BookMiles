var express = require("express");
var app = express();
var mongojs = require("mongojs");
var db = mongojs('bosscal',['bosscal']);
var bodyParser = require("body-parser");
//In New York!!!

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

app.get('/bosscal', function(req, res){
	db.todolist.find(function(err, docs){
    console.log("Received a list:");
		console.log(docs);
		res.json(docs);
	});

});

app.post("/bosscal", function(req, res){
  req.body.status = "In Progress";
  console.log("Adding:");
	console.log(req.body);
	db.todolist.save(req.body, function(err, docs){
		res.json(docs);
	});

});

app.delete('/bosscal/:id', function (req, res) {
  var id = req.params.id;
  db.todolist.remove({_id: mongojs.ObjectId(id)}, function (err, doc) {
    console.log("Removed " + id);
    res.json(doc);
  });
});

app.get('/bosscal/:id', function (req, res) {
  var id = req.params.id;
  console.log("Editing " + id);
  db.todolist.findOne({_id: mongojs.ObjectId(id)}, function(err, doc){
     res.json(doc);
  });
});

app.post('/bosscal/:id', function (req, res) {
  var id = req.params.id;
  db.todolist.findOne({_id: mongojs.ObjectId(id)}, function(err, doc){
    if ("Completed".localeCompare(doc.status) == 0) {
      toggleTodo(id, res, "In Progress");
    }
    else {
      toggleTodo(id, res, "Completed");
    }
  })
  
});

function toggleTodo(id, res, status) {
  console.log("Toggling " + id + " to " + status);
  db.todolist.findAndModify(
    { query: {_id: mongojs.ObjectId(id)},
      update: {$set: {status: status}},
      new: true
    }, function(err, doc) {
      res.json(doc);
    }
  );
}

app.put('/todolist/:id', function (req, res) {
  var id = req.params.id;
  console.log("Edit saved for " + id);
  db.todolist.findAndModify(
   { query: {_id: mongojs.ObjectId(id)}, 
     update: {$set: {title: req.body.title, text: req.body.text, due: req.body.due}},
     new: true 
   }, function(err, doc){
     res.json(doc);
   });
});

app.listen(3000);

console.log("Server running on port 3000");
