var models = require('../models');
var Reply = models.Reply;
var User = require('./users');
var tools = require('../common/tools');
var EventProxy = require('eventproxy');
var at = require('../common/at');


//get one reply 
exports.getReply = function(id, callback){
   Reply.findOne({_id: id}, callback);
};
//get reply by its id
exports.getReplyById = function(id, callback){
   if(!id) {
   	 return callback(null, null);
   }
   Reply.findOne({_id: id}, function(err, reply){
      if(err) {
      	 return callback(err);
      }
      if(!reply){
      	return callback(null, [])
      }

      User.getUserById(reply.author_id, function(err, author){
         if(err) {
         	return callback(err);
         }
         reply.author = author;

         at.linkUsers(reply.content, function(err, str){
             if(err){return callback(err);}
             reply.content = str;
             return callback(null, reply);
         });
      });      
   });
};

exports.getRepliesByBlogId = function(id, callback){
   Reply.find({blog_id: id, deleted: false},'', {sort: 'create_at'}, function(err, replies){
   	  if(err) {return callback(err)};
   	  if(replies.length === 0) {
   	  	return callback(null, []);
   	  }

   	  var proxy = new EventProxy();
      proxy.after('reply_found', replies.length, function(){
      	return callback(null, replies));
      });  
    

   	  replies.forEach(function(reply, i){
          User.getUserById(reply.author_id, function(err, author){
              if(err) { return callback(err);}
              if(!author) {
              	reply = null;
              }
              else {
              	reply.author = author ;
              }
              at.linkUsers(reply.content, function(err, str){
              	 reply.content = str;
              	 proxy.emit('reply_found');
              })
          });
   	  });
   });
};

exports.newAndSave = function(content, blogId, authorId, replyId, callback){
   if(typeof replyId === 'function'){
   	callback = replyId;
   	replyId = null;
   }
   var reply = new Reply();
   reply.content = content;
   reply.blog_id = blogId;
   reply.author_id = authorId;
   if(reply_id) {
   	 reply.reply_id = reply_id;
   } 
   reply.save(function(err){
   	  callback(err, reply);
   });
};
//get Last Reply of a blog
exports.getLastReplyBlogId = function(blogId, opt, callback){
  Reply.find({blog_id: blogId, deleted: false}, '_id', {sort: {create_at: -1}, limit: 1}, callback);
};

exports.getRepliesByAuthorId = function(authorId, opt, callback) {
	//for two input params
	if(!callback) {
		callback = opt;
		opt = null;
	}
	Reply.find({author_id: authorId}, {}, opt, callback);
};
//totol replies by one author
exports.getCountByAuthorId = function(authorId, callback) {
   Reply.count({author_id, authorId}, callback);
};