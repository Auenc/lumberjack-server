//Dependencies
var restful = require("node-restful");
var mongoose = restful.mongoose;

var Instance = require('./instance');

const uuidV4 = require('uuid/v4');

//Schema
var programScheme = new mongoose.Schema({
  name: String,
  token : String,
  Instances : [{type: mongoose.Schema.Types.ObjectId, ref: 'Instance'}]
});


programScheme.methods.newInstance = function(colId, callback){
  var instance = new Instance({
    _program : this._id,
    _collector : colId,
  });
  instance.save();
  this.Instances.push(instance);
  this.save();
  callback(instance);
}

programScheme.methods.getInstance = function(instanceID){
  
  Instance.find({_id: instanceID}, function(err, instance){
    if(err) throw err;
    return instance[0];
  })
  return null;
}

//Return model
module.exports = restful.model("Program", programScheme);
