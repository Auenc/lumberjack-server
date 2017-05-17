//Dependencies
var restful = require("node-restful");
var mongoose = restful.mongoose;

var func = require("./function");

//Schema
var threadScheme = new mongoose.Schema({
  Stack : [{type: mongoose.Schema.Types.ObjectId, ref: "Function"}]
});

//Return model
module.exports = restful.model("Thread", threadScheme);
