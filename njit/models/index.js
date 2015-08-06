var mongoose = require('mongoose');
var config = require('../config');

mongoose.connect(config.db, function(err){
	if(err){
		console.log('connect to %s error: ', config.db, err.message);
	}
	var db = mongoose.connection.db;

	console.log('connect to '+ config.db+'  successfully!');
});

//models
require('./users');
require('./blogs');

exports.User  =  mongoose.model('User');
exports.Blog  =  mongoose.model('Blog');
