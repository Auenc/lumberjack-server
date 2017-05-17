//Dependencies
var restful = require("node-restful");
var mongoose = restful.mongoose;

var Variable = require("./variable");

//Schema
var functionStateScheme = new mongoose.Schema({
  ID : String,
  Cause: String,
  Variables : [{type: mongoose.Schema.Types.ObjectId, ref: "Variable"}]
});


functionStateScheme.statics.createState = function(data){
  if(data == null || data == undefined)return null;
  var fun = new this();
  //Set up ID and Cause
  fun.ID = data.ID;
  fun.Cause = data.Cause;
  //Create variables
  for(var key in data.Variables){
    fun.Variables.push(Variable.createVariable(data.Variables[key]));
  }
  fun.save(function(err){
    if(err) console.log("Error saving state", err);
  });

  return fun;
}

//Return model
module.exports = restful.model("FunctionState", functionStateScheme);
