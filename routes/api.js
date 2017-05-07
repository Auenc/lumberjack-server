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

var Program = require("../models/program");

Program.methods(['get', 'put', 'post', 'delete']);

Program.before("post", function(req, res, next){
    req.body.token = uuidV4();
    next();
});

Program.register(router, "/programs");



//Return router
module.exports = router;
