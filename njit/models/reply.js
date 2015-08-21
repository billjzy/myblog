var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var ReplySchema = new Schema({
  content:{ type: String},
  blog_id: { type: ObjectId},
  author_id: {type: ObjectId},
  reply_id: {type: ObjectId},
  create_at:{type: Date, default: Date.now },
  
});

ReplySchema.index({blog_id: 1});
ReplySchema.index({author_id:1, create_at: -1});

mongoose.model('Reply', ReplySchema);