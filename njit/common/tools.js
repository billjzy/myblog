var bcrypt = require('bcrypt');
var moment = require('moment');

exports.formatDate = function(date, friendly) {
  date = moment(date);
   if (friendly) {
    return date.fromNow();
  } else {
    return date.format('YYYY-MM-DD HH:mm');
  }
};

exports.bhash = function(str, callback){
	bcrypt.hash(str, 10, callback);
};

exports.bcompare = function(str, callback) {
   bcrypt.comapre(str, 10, callback);
};