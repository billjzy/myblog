var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	email: {type:String, unique:true},
	pass: {type: String},
	name: {
		first: {type: String},
		last: {type: String}
	},
	phone: {type: String},
	major: {type:String},




	topic_count:  {type: Number, default: 0 },
	reply_count: {type: Number, default: 0},
	follower_count: {type: Number, default: 0},
    following_count: {type: Number, default: 0},
    create_at: { type: Date, default:Date.now}


});
mongoose.model('User', UserSchema);
