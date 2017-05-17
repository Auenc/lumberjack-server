//Dependencies
var express = require('express');
var router = express.Router();

const uuidV4 = require('uuid/v4');

//Models
/*var Todo = require("../models/todo");

// Routes
Todo.methods(['get', 'put', 'post', 'delete']);
Todo.register(router, "/todos");*/

var Collector = require("../models/collectors");

Collector.methods(['get', 'put', 'post', 'delete']);

Collector.before("post", function(req, res, next){
    req.body.token = uuidV4();
    next();
});

Collector.register(router, "/collectors");

console.log("Created collector handlers");

var Program = require("../models/program/program");
//var Program = require("node-restful").model("Program", ProgramSchema)
Program.methods(['get', 'put', 'post', 'delete']);

Program.before("post", function(req, res, next){
    req.body.token = uuidV4();
    next();
});

Program.register(router, "/programs");


var Instance = require("../models/program/instance");
Instance.methods(['get', 'put', 'post', 'delete'])

Instance.register(router, "/instance");


var Action = require("../models/program/action");
Action.methods(['get', 'put', 'post', 'delete']);

Action.register(router, "/action");


var lFunction = require("../models/program/function");
lFunction.methods(['get', 'put', 'post', 'delete']);

lFunction.route("caller/:id", function(req, res, next){
  console.log("Handle caller with", req.params.id);
  //lFunction.find({ID: })
});

lFunction.register(router, "/function");

var FunctionState = require("../models/program/function-state");
FunctionState.methods(["get", "put", "post", "delte"]);
FunctionState.register(router, "/function-state");

var Variable = require("../models/program/variable");
Variable.methods(["get", "put", "post", "delete"]);
Variable.register(router, "/variable");

//Return router
module.exports = router;
