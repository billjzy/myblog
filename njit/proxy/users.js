//dealing with db ops
var models = require('../models');
var User = models.User;

//pre process for the model
exports.getUserByEmail = function(email, callback){	 
	User.findOne({'email': email}, callback);
};

exports.getUserByName = function(username, callback) {
   User.findOne({'username': username}, callback);
};

exports.newAndSave = function(username, email, pass, callback){ 
  var user    = new User();
  user.username   = username;
  user.email  = email;
  user.pass   = pass;
  user.save(callback);
};

exports.getUserById = function(id, callback){
  if(!id){
  	return callback();
  }
  User.findOne({_id: id}, callback);
}


