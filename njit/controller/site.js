var User = require('../proxy').User;
var config = require('../config');

exports.index = function(req, res, next){

  res.render('index');
};