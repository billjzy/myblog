var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var UserSchema = new Schema({
	username: {type:String},
	email: {type:String},
	pass: {type: String},

	name: {
		first: {type: String},
		last: {type: String}
	},
	phone: {type: String},
	major: {type:String},
    
    address: {type: String},

	topic_count:  {type: Number, default: 0 },
	reply_count: {type: Number, default: 0},
	follower_count: {type: Number, default: 0},
    following_count: {type: Number, default: 0},
    create_at: { type: Date, default:Date.now}

});
UserSchema.index({username: 1}, {unique: true});
UserSchema.index({email:1}, {unique: true});
mongoose.model('User', UserSchema);
