var User = require('../proxy').User;
var util = require('util');
var tools = require('../common/tools');
var validator = require('validator');
var utility = require('utility');
var _ = require('lodash');
var eventproxy = require('eventproxy');


exports.index = function(req, res, next){
    var username = req.params.username;
    User.getUserByName(username, function(err, user){
       if(err) return next(err);
       if(!user) {
       	res.render('/');
       	return;
       }
       res.render('user/index', {
       	 user: user   
       });
    });

};

exports.showProfile = function(req, res, next){
     User.getUserById(req.session.user._id, function(err, user){
         if(err) {
         	return next(err);
         }
         if(req.query.save === 'success'){
         	user.success = 'saved successfully';
         }
         user.error = null;
         return res.render('user/profile', user);//return render... in source code 
     });
};

exports.profile = function(req, res, next){

  var ep = new eventproxy();
  ep.fail(next);
  //udpdate personal info


  function showMessage(msg, data, isSucc) {
      data = data || req.body;
      var data2 = {
         name: {
         	first: data.name.first,
         	last: data.name.last
         },
         email: data.email,
         major: data.major,
         address: data.address,
         phone: data.phone
      };
      if(isSucc) {
      	data2.success = msg;
      }
      else {
      	data2.error = msg;
      }
      return res.render('user/profile', data2);
  }

  var action = req.body.action;
  if(action ==='change_setting') {
  	var first_name = validator.trim(req.body.first);
  	var last_name = validator.trim(req.body.last);
    var address = validator.trim(req.body.address);
    var major = validator.trim(req.body.major);
    var phone = validator.trim(req.body.phone);

    User.getUserById(req.session.user._id, function(err, user){
      user.name.first = first_name;
      user.name.last =  last_name;
      user.major = major;
      user.address = address;
      user.phone = phone;    
      user.save(function(err){
         if(err) {
         	return next(err);
         }
         //update user in the sessoin
         req.session.user = user.toObject({virtual: true});
         return res.redirect('/setting?save=success');
      });
    });
  }

  if(action==='change_password') {
      var old_pass = validator.trim(req.body.old_pass);
      var new_pass = validator.trim(req.body.new_pass);

      if(!old_pass||!new_pass) {
      	return res.send('empty input');
      }
      
      User.getUserById(req.session.user._id, ep.done(function(user){
         tools.bcompare(old_pass, user.pass, ep.done(function(bool){
         	if(!bool){
         		return showMessage('incorrect password', user, false);
         	}
         	tools.bhash(new_pass, ep.done(function(passhash){
               user.pass = passhash;
               user.save(function(err){
               	if(err) return next(err);
               	return showMessage('password changed', user, true);
               });
                 
         	}));
         }));
      }));
   
     }

};

