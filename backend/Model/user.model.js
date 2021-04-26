const mongoose = require('mongoose');

//simple schema
const UserSchema = new mongoose.Schema({
	user_name: {
		type: String,
		required: true,
		maxlength: 50,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	status:{
		type: String, 
		enum: ['Active', 'Reported', 'Deleted', 'Blocked']
	},
	about:{
		type: String,
	},
	friends:[{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
	friendRequests:[{
		type: mongoose.Schema.Types.ObjectId, ref: 'Request'
	}]

}, { timestamps: { createdAt: 'created_at' }});

const user = mongoose.model('User', UserSchema);
exports.User = user;
