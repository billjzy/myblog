var User       = require('../proxy').User;
var Message    = require('./message');
var EventProxy = require('eventproxy');
var _          = require('lodash');

var fetchUsers = function(text){
	if(!text){
		return [];
	}

	var ignoreRegexs = [
    /```.+?```/g, 
    /^```[\s\S]+?^```/gm, 
    /`[\s\S]+?`/g, 
    /^    .*/gm, 
    /\b\S*?@[^\s]*?\..+?\b/g, 
    /\[@.+?\]\(\/.+?\)/g, 
    ];

    ignoreRegexs.forEach(function(ignore_regex){
        text = text.replace(ignore_regex, '');
    });

    var results = text.match(/@[a-z0-9\-_]+\b/igm);
    var names = [];

    if(results) {
    	for(var i=0; i < results.length; i++) {
    		var s = results[i];
    		s = s.slice(1);
    		names.push(s);
    	}
    }
    names = _.uniq(names);
    return names;
};
exports.fetchUsers = fetchUsers;

exports.sendMessageToMentionUsers = function (){};

exports.linkUsers = function(text, callback){
  var users = fetchUsers(text);
  for(var i=0, i<users.length;i++) {
  	var name = users[i];
  	text = text.replace(new RegExp('@' + name + '\\b(?!\\])', 'g'), '[@' + name + '](/user/' + name + ')');
  }
  if(!callback) {
  	return text;
  }
  return callback(null, text);
};
