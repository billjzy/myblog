var validator = require('validator');
var Blog = require('../proxy').Blog;
var ep = require('eventproxy');


exports.index = function(){};

exports.create = function(req, res, next){
  res.render('blog/edit');
};

