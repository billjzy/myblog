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
  next();
};


//create signedcookie, store user information
function generateSession(user, res){
  var auth_token = user._id + '$$$$';
  var opts = {
     path: '/',  
     maxAge: 3000000000,
     httpOnly: true,
     signed: true
  };
  res.cookie(config.auth_cookie_name, auth_token, opts);//signedCookie sent to cli
}
exports.generateSession = generateSession;


//check if the user is authorized
// 
exports.authUser = function(req, res, next){
   res.locals.current_user = null;
   var ep = new eventproxy();
   ep.fail(next);

   ep.all('get_user', function(user){
      //dont need to handle err
       if(!user){
        return next();
       }
   
       res.locals.current_user = req.session.user = new UserModel(user);    
       return next();
   }); 

    if(req.session.user) {
      ep.emit('get_user', req.session.user);
    }

    else {
   	 var auth_token = req.signedCookies[config.auth_cookie_name];
   	 if(!auth_token) {
   	 	 return next();//no user info in session cookie
   	 }

   	 var auth = auth_token.split('$$$$');
   	 var id = auth[0]; 
     UserProxy.getUserById(id, ep.done('get_user')); 
    }
};

