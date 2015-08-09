var mongoose = require('mongoose');
var UserModel = require('../models').User;

var config = require('../config');
var eventproxy  = require('eventproxy');
var UserProxy = require('../proxy').User;


//need login
exports.userRequired = function(req, res, next){
  if(!req.session||!req.session.user){
  	return res.status(403).send('forbiden!');
  }
};


//create signedcookie, store user information
exports.generateSession = function(email,res){
  var auth_token = email + '$$$$';
  var opts = {
     path: '/',
     maxAge: 3000000000,
     secure: true,
     httpOnly: true
  };
  res.cookie(config.auth_cookie_name, auth_token, opts);
};



//check if the user is authorized
// 
exports.authUser = function(req, res, next){
   var ep = new eventproxy();
   ep.fail(next);
   
   ep.all('get_user', function(user){
    if(user){
      user = res.locals.current_user = req.session.user = new UserModel(user);
    }
    ep.done(next);
   });

   //after request recieved
   if(req.session.user) {
     ep.emit('get_user', req.session.user)
   }
   else {
   	 var auth_token = req.signedCookies[config.auth_cookie_name];
   	 if(!auth_token) {
   	 	return next();//no user info in session cookie
   	 }
   	 var auth = auth_token.split('$$$$');
   	 var email = auth[0];

   	 UserProxy.getUserByEmail(email, ep.done('get_user'));
   }

};
