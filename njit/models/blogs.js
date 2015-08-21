var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var BlogSchema = new Schema({
  title: {type: String},
  content:{type: String},
  author_id:{type: ObjectId},

  top:{type: Boolean, default: false},
  good:{type: Boolean, default: false},
  collect_count:{type:Number, default: 0},
  reply_count: {type: Number, default: 0},
  visit_count:{type: Number, default: 0},
  create_at: {type: Date, default: Date.now},
  update_at: {type: Date, default: Date.now},
  

});

BlogSchema.index({create_at: -1});
BlogSchema.index({author: 1, create_at: -1});

mongoose.model('Blog', BlogSchema);