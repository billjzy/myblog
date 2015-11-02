var models = require('../models');
var Blog = models.Blog;
var User = require('./users');
var tools = require('../common/tools');
var EventProxy = require('eventproxy');
var Reply = require('./reply');
var _ = require('lodash');

exports.getBlogById = function(id, callback) {
	var ep = new EventProxy();
	var events = ['blog', 'author', 'last_reply'];
	ep.assign(events, function(blog, author, last_reply){
       if(!author) {
       	 return callback(null, null, null, null);
       }
       return callback(null, blog, author, last_reply);
	}).fail(callback);

    Blog.findOne({_id: id}, ep.done(function(blog){
          if(!blog) {
          	ep.emit('blog', null);
          	ep.emit('author', null);
          	ep.emit('last_reply', null);
            return;
          }
          ep.emit('blog', blog);
   
   
          User.getUserById(blog.author_id, ep.done('user'));
          //if the blog retrived has last reply
          if(blog.last_reply){
              Reply.getRepliesById(blog.last_reply, proxy.done(function(last_reply))){
              	 proxy.emit('last_reply', last_reply);
              })); 
          } else {
          	proxy.emit('last_reply', null);
          }
      }));         
};
//return number of search results
exports.getCountByQuery = function(query, callback){
  Blog.count(query, callback);
};
//search blog by key word, return blogs
exports.getBlogsByQuery = function(query, opt,  callback){
  query.deleted = false;
  Blog.find(query, {}, opt, function(err, blogs){
  	if(err) {
  		return callback(err);
  	}
    if(blogs.length === 0){
    	return callback(null, []);
    }

    var ep = new EventProxy();
    ep.after('blog_ready', blogs.length, function(){
    	blogs = _.compact(blogs);
    	return callback(null, blogs);
    });
    ep.fail(callback);
    
    blogs.forEach(function(blog, i){
    	var proxy = new EventProxy();
    	proxy.all('author', 'reply', function(author, reply){
    		if(author) {
    			blog.author = author;
    			blog.reply = reply;
    		}else {
    			blogs[i] = null;
    		}
    		ep.emit('blog_ready');
    	});

    	User.getUserById(blog.author_id, proxy.done('author'));
    	Reply.getReplyById(blog.last_reply, proxy.done('reply'));
    });
  });
};
//return blog with all its replies
exports.getFullBlog = function(id, callback){
   var proxy = new EventProxy();
   var events = ['blog', 'author', 'replies'];
   
   proxy.assign(events, function(blog, author, replies){
   	 callback(blog, author, replies);
   }).fail(callback);

   Blog.findOne({_id: id, deleted: false}, proxy.done('blog', function(blog){
   	  if(!blog) {
   	  	proxy.unbind();
   	  	return callback(null, 'Blog not exist!');
   	  }
   	  proxy.emit('blog', blog);


      User.getUserById(blog.author_id, proxy.done(function(author){
      if(!author){
      	 proxy.unbind();
      	 return callback(null, 'Author not exist!');
      }
      proxy.emit('author', author);     
      }));

      Reply.getRepliesByBlogId(blog._id, proxy.done('replies'));
  }));
};	

exports.updateLastReply = function(blogId, replyId, callback){
  Blog.findOne({_id: blogId}, function(err, blog){
  	if(err||!blog) {
  		return callback(err);
  	}
  	blog.last_reply = replyId;
  	blog.last_reply_at = new Date();
  	blog.reply_count += 1;
  	blog.save(callback);
  });
};

exports.getBlog = function(id, callback) {
	Blog.findOne({_id: id}, callback);
};

//deleting a reply
exports.reduceCount = function(id, callback){
    Blog.findOne({_id: id}, function(err, blog){
    	if(err){
    		return callback(err);
    	}
    	if(!blog) {
    		return callback('blog not exist');
    	}
    	blog.reply_count -= 1;
    	Reply.getLastReplyByBlogId(id, function(err, reply){
            if(err){
            	return callback(err);
            }
            if(reply.length !== 0){
            	blog.last_reply = reply[0]._id;
            }else{
            	blog.last_reply = null;
            }
            blog.save(callback);
    	});
    });
};

exports.newAndSave = function(title, content, tab, authorId, Callback){
	var blog = new Blog();
	blog.title = title;
	blog.content = content;
	blog.tab = tab;
	blog.author_id = authorId,
	blog.save(callback);
};

