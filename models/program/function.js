//Dependencies
var restful = require("node-restful");
var mongoose = restful.mongoose;

var Variable = require("./variable");
var functionState = require("./function-state");

//Schema
var functionScheme = new mongoose.Schema({
  ID : String,
  Name: String,
  CallerID : String,
  Calls : [{type: mongoose.Schema.Types.ObjectId, ref: "Function"}],
  States : [{type: mongoose.Schema.Types.ObjectId, ref: "FunctionState"}],
  ReturnValues : [{type: mongoose.Schema.Types.ObjectId, ref: "Variable"}]
});

functionScheme.statics.createFunction = function(data){
  if(data == null || data == undefined)return null;

  var fun = new this();
  //Set up ID, Name, and CallerID
  fun.ID = data.ID;
  fun.Name = data.Name;
  fun.CallerID = data.CallerID;
  //Create calls
  for(var i = 0; i < data.Calls.length;i++){
    fun.Calls.push(functionScheme.createFunction(data.Calls[i]));
  }
  //Create states
  for(var state in data.States){
    fun.States.push(functionState.createState(data.States[state]));
  }
  //Create returns
  for(var i = 0; i < data.ReturnValues.length;i++){
    fun.ReturnValues.push(Variable.createVariable(data.ReturnValues[i]));
  }
  fun.save(function(err){
    if(err) console.log("Error saving function", err);
  });
  //Return
  return fun;
};

//Return model
module.exports = restful.model("Function", functionScheme);
