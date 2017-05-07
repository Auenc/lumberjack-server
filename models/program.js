//Dependencies
var restful = require("node-restful");
var mongoose = restful.mongoose;

//Schema
var programScheme = new mongoose.Schema({
  name: String,
  token : String
});


//Return model
module.exports = restful.model("Program", programScheme);
