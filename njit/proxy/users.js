var models = require('../models');
var User = models.User;

//pre process for the model
exports.getUserByEmail = function(email, callback){
	User.find({'email': email}, callback);
};

exports.newAndSave = function(email, pass, callback){
  var user    = new User();
  user.email  = email;
  user.pass   = pass;
 
  user.save(callback);

};