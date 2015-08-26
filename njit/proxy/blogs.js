var eventproxy = require('eventproxy');
var models = require('../models');

var Blog = models.Blog;
var User = require('./users');
var tools = require('../common/tools');

exports.getBlogById = function(id, callback) {
   var ep = new eventproxy();
   var events = ['Blog','author', 'last_reply'];

};
