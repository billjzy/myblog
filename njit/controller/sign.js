var validator = require('validator');
var User = require('../proxy/').User;
var eventproxy =  require('eventproxy');
var tools = require('../common/tools'); 
var authMiddleWare = require('../middlewares/auth');
var config = require('../config');

exports.showSignup = function(req, res){
  res.render('register');
}


exports.signup = function(req, res, next) {
  var email = validator.trim(req.body.email).toLowerCase();
  var pass = validator.trim(req.body.pass);  
  var repass = validator.trim(req.body.re_pass);
  var ep = new eventproxy();

  ep.fail(next);

  ep.on('sign_err', function(msg){
     res.render('register',{msg:msg});
  });
  
  if([email, pass, repass].some(function(item){
     return item === '';
  })) {
  	return ep.emit('sign_err', 'Empty input!');
  }

  if(!validator.isEmail(email)) return ep.emit('sign_err', 'illegal email format!');
  if(pass!=repass) return ep.emit('sign_err', 'retype password not match!');

  User.getUserByEmail(email, function(err, user){
  	if(err) return next(err);
  	if(user) {
  		ep.emit('sign_err', 'email already exists!');
  		return ;
  	}

    tools.bhash(pass, ep.done(function(passhash){
	  User.newAndSave(email, passhash, function(err){
	     if(err) {
	        return next(err);
	     }   
	     authMiddleWare.generateSession(users[0], res);

	     res.render('index',{msg:'Sign up successfully, Welcome!'});
	    });   
	}));
  });
};


exports.showSignin = function(req, res){
  if(req.session.user) res.render('index');
  else {
  	res.render('signin');
  }
};

exports.signin = function(req, res, next){
  var email = validator.trim(req.body.email);
  var pass = validator.trim(req.body.pass);
  
  var ep = new eventproxy();
  ep.on('signin_err', function(msg){
     res.render('signin',{msg:msg});
  });

  if([email, pass].some(function(item){
  	return item==='';
  })){
  	return ep.emit('signin_err', 'empty input!');
  }
  
  if(!validator.isEmail(email)) {
  	return ep.emit('signin_err', 'invalid email!');
  }

  User.getUserByEmail(email, function(err, user){
  if(err){
  	return next(err);
  }
  if(!user){
  	return ep.emit('sign_err', 'no user in db');
  }
  
  var passhash = user.pass;
  
  tools.bcompare(pass, passhash, ep.done(function(bool){
     if(!bool) {
     	return ep.emit('sign_err', 'wrong email or password');
     }
  
     authMiddleWare.generateSession(user, res);
     //user redirect instead of render
     //because res.bookie is not passed to cli until this 
     //write res is finished--
     res.redirect('/');
  }));
 });
};


exports.signout = function(req, res, next){
   req.session.destroy();
   res.clearCookie(config.auth_cookie_name, {path: '/'});
   res.redirect('/');
};
