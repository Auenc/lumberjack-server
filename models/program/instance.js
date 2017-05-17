//Dependencies
var restful = require("node-restful");
var mongoose = restful.mongoose;

var LumberThread = require("./thread");
var Action = require("./action");
var LFunction = require("./function");
//Schema
var instanceScheme = new mongoose.Schema({
  _collector : String,
  _program : String,
  Functions : [{type : mongoose.Schema.Types.ObjectId, ref: "Function", unique: true, dropDups: true}],
  Actions : [{type : mongoose.Schema.Types.ObjectId, ref: "Action"}],
  MainThread : {type: mongoose.Schema.Types.ObjectId, ref: "Thread"},
  Workers : [{type: mongoose.Schema.Types.ObjectId, ref: "Thread"}]
});

instanceScheme.methods.addAction = function(dataString){
  var data = JSON.parse(dataString);
  var instance = this;
  var dup = false;
  var action = new Action({
    ID: data.ID,
    Type: data.Type,
    Invoke : data.Invoker,
    Data : data.Data,
    TimeCreated: data.TimeCreated
  });


  Action.find({Type: action.Type, TimeCreated : action.TimeCreated}, function(err, results){
    if(!results.length){
      console.log("Not a dup", action.Type);
      instance.Actions.push(action);
      instance.save();
      action.setData(data.Data, function(){
        //instance.Actions.push(action);
        instance.save(function(err){
          if(err)console.log("Error saving instance", err);
        }).then(function(data){
            console.log("instance action added", action.Type);
        });
      });
    }else{
      console.log("A dup", action.Type);
    }
  });
  this.compileStructure();
}

instanceScheme.methods.hasFunction  = function(functionName){
  for(var i = 0; i < this.Functions.length;i++){
    LFunction.findOne({_id : this.Functions[i]}).exec(function(err, result){
      if(result.Name == functionName){
        console.log("Already exists", result.Name, functionName)
        return true;
      }
    });

  }
  console.log("Doesnt exists", functionName)
  return false;
}

instanceScheme.methods.compileStructure  = function(){
  var self = this;
  console.log("Compile called");
  for(var i = 0; i < this.Actions.length;i++){
    Action.findOne({_id: this.Actions[i]}).populate("Data").exec(function(err, result){
      if(err) return;
      var action= result;
      console.log("Action", action);
      if(!self.hasFunction(action.Data.Name)){
        self.Functions.push(action.Data);
        self.save();
      }
    });

  }

}

//Return model
module.exports = restful.model("Instance", instanceScheme);
