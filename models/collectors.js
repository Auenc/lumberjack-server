//Dependencies
var restful = require("node-restful");
var mongoose = restful.mongoose;

//Schema
var collectorScheme = new mongoose.Schema({
  name: String,
  connected: Boolean,
  token : String
});


//Return model
module.exports = restful.model("Collector", collectorScheme);
