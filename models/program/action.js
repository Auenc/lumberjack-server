//Dependencies
var restful = require("node-restful");
var mongoose = restful.mongoose;

var LumberFunction = require("./function");

//Schema
var actionScheme = new mongoose.Schema({
  ID : String,
  Type : String,
  Invoker : String,
  Data : {type: mongoose.Schema.Types.ObjectId, ref: "Function"},
  TimeCreated : {type: Date, unique : true, required : true, dropDups: true}
});

actionScheme.methods.setData = function(data, callback){
  //Setup ID, Type, and Invoker
  this.Data = LumberFunction.createFunction(data);
  this.save(function(err){
    if(err)console.log("Error saving action", err);
  });
  callback();
}

//Return model
module.exports = restful.model("Action", actionScheme);
