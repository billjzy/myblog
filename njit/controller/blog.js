var validator = require('validator');
var Blog = require('../proxy').Blog;
var ep = require('eventproxy');


exports.index = function(req, res ,next){
  
  var blog_id = req.params.b_id;
  var events = 

};

exports.create = function(req, res, next){
  res.render('blog/edit');
};

