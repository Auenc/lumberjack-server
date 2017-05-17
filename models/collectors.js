//Dependencies
var restful = require("node-restful");
var mongoose = restful.mongoose;


//Schema
var collectorScheme = new mongoose.Schema({
  name: String,
  connected: Boolean,
  token : String,
  Instances : [{type : mongoose.Schema.Types.ObjectId, Ref: "Instance"}]
});


//Return model
module.exports = restful.model("Collector", collectorScheme);
