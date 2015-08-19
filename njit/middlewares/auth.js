var mongoose = require('mongoose');
var UserModel = mongoose.model('User');

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
exports.generateSession = function(user, res){
  var auth_token = user.email + '$$$$';
  var opts = {
     path: '/',  
     maxAge: 3000000000,
     httpOnly: true,
     signed: true
  };
  res.cookie(config.auth_cookie_name, auth_token, opts);//signedCookie sent to cli
};



//check if the user is authorized
// 
exports.authUser = function(req, res, next){
   res.locals.current_user = null;
   var cb = function(err, user){
    console.log(user);
     if(!err) {
       res.locals.current_user = req.session.user = new UserModel(user);
      }
      //console.log(req.session.user);
      return next();
   };

   //after request recieved
   if(req.session.user) {
     cb(null, req.session.user);
   }
   else {    
   	 var auth_token = req.signedCookies[config.auth_cookie_name];
   	 if(!auth_token) {
   	 	 return next();//no user info in session cookie
   	 }
     else {
   	 var auth = auth_token.split('$$$$');
   	 var e = auth[0]; 
     UserProxy.getUserByEmail(e, cb);
     }
    }
};

