var validator = require('validator');
var User = require('../proxy/').User;
var eventproxy =  require('eventproxy');
var tools = require('../common/tools'); 

exports.signup = function(req, res, next) {
  var email = validator.trim(req.body.email).toLowerCase();
  var pass = validator.trim(req.body.pass);  
  var repass = validator.trim(req.body.re_pass);
  var ep = new eventproxy();

  ep.fail(next);

  ep.on('sign_err', function(msg){
     res.status(422);
     res.render('register', function(){
     	console.log(msg);
     });
  });
  
  if([email, pass, repass].some(function(item){
     return item === '';
  })) {
  	return ep.emit('sign_err', 'Empty input!');
  }

  if(!validator.isEmail(email)) return ep.emit('sign_err', 'illegal email format!');
  if(pass!=repass) return ep.emit('sign_err', 'retype password not match!');

  User.getUserByEmail(email, function(err, users){
  	if(err) return next(err);
  	if(users.length>0) return ep.emit('sign_err', 'email already exists!');
  });
 
 
  tools.bhash(pass, ep.done(function(passhash){
	  User.newAndSave(email, passhash, function(err){
	     if(err) {
	        return next(err);
	     }
	     res.render('register');
	    });   
	}));
};
