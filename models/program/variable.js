//Dependencies
var restful = require("node-restful");
var mongoose = restful.mongoose;

//Schema
var variableScheme = new mongoose.Schema({
  Name : String,
  Value: String,
  Type : String,
  Description : String
});

variableScheme.statics.createVariable = function(data){
  if(data == null || data == undefined)return null;
  var v = new this();
  v.Name = data.Name;
  v.Value = data.Value;
  v.Type = data.Type;
  v.Description = data.Description;
  v.save(function(err){
    if(err) console.log("Error saving variable", err);
  });
  return v;
}

//Return model
module.exports = restful.model("Variable", variableScheme);
