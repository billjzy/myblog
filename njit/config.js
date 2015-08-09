var path = require('path');

var config = {
	db: 'mongodb://localhost/myblog',

	redis_host: 'localhost',
	redis_port: 6379,
	redis_db: 0,

	session_secret: 'njit_secret',//used for cookie -> signedCookie
	auth_cookie_name: 'njit'
    
}

module.exports = config;