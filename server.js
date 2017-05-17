//Imports
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

//MongoDb
mongoose.connect("mongodb://localhost/lumberjack_test");

//Express
var app = express();


app.use(bodyParser(bodyParser.urlencoded({enxtended: true})));
app.use(bodyParser.json());

//Middleware
// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

//Routes
app.use("/api", require("./routes/api"));

//Start server
app.listen(3030);
console.log("Api is running");

var collectorApp = express();

//Socket set ups
//Collector setup
var collectorServer = require('http').createServer(collectorApp);
var collectorIo = require('socket.io').listen(collectorServer);

//Events
collectorIo.sockets.on('connection', function(collector){
  var Collector = require("./models/collectors");
  console.log("Collector connected");
  //Ask collector for it's token
  collector.emit("provide-token");


  collector.on("token", function(token){
    console.log("Token recieved", token);
    Collector.find({token: token}, function(err, c){
      if(err) throw err;
      collector.collector = c[0];
    });
    Collector.update({token: token}, {
      connected : true
    }, function(err, num, raw){
      console.log("Updated online");
    });
  });

  collector.on('disconnect', function(arg){
    console.log("Collector has disconnected", collector.collector.token);
    Collector.update({token: collector.collector.token}, {
      connected : false
    }, function(err, num, raw){
      if(err) throw err;
      console.log("Updated offline", num);
    });
  })

});

collectorServer.listen(3031, function(){
  var port = collectorServer.address().port;

  console.log("CollectorServer running on port %s", port);
});

var programApp = express();

var programServer = require('http').createServer(programApp);
var programIo = require('socket.io').listen(programServer);

//Events
programIo.sockets.on('connection', function(program){
  var Collector = require('./models/collectors');
  var Program = require('./models/program/program');
  var Instance = require("./models/program/instance");

  program.emit("provide-token");

  program.on("token", function(token){
    console.log("Token recieved program socket", token);
    Collector.find({token: token}, function(err, c){
      if(err) throw err;
      program.collector = c[0];
      console.log("Collector found");
      program.emit("provide-program-token");
    });
  });


  program.on("program-token", function(token){
    //If we don't have a registered collector, aask for token
    if(program.collector == null){
      program.emit("provide-token");
      return;
    }
    console.log("Program token received", token);
    //Finding program
    Program.find({token: token}, function(err, prog){
      if(err) throw err;
      cProgram = prog[0];
      //console.log("Prog: ", cProgram);

      cProgram.newInstance(program.collector._id, function(instance){
          program.instance = instance;
          program.collector.Instances.push(instance._id);
          program.collector.save(function(err){
            if(err) console.log("Error saving collector", err) ;
          });
      });

      program.program = cProgram;
      program.emit("collect");
    });

  });

  program.on("action", function(action){
    console.log("Action recieved", JSON.parse(action).Type);
    if(!program.instance)return;
    console.log("instanceID", program.instance._id);
    /*Instance.find({_id : program.instance}, function(err, instanceL){
      console.log("Found instances", instanceL);
        var instance = instanceL[0];
        instance.addAction(action);
    });*/
    program.instance.addAction(action);
    program.program.save(function(err){
      if(err)console.log("Error saving program", err);
    })
    //var instance = program.program.;
    //
  })
});

programServer.listen(3032, function(){
  var port = programServer.address().port;
  console.log("ProgramServer running on port %s", port);
});
