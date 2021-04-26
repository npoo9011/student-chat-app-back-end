const mongoose = require('mongoose');

//simple schema
const AdminSchema = new mongoose.Schema({
	user_name: {
		type: String,
		required: true,
        unique:true,
		maxlength: 50,
	},
	password: {
		type: String,
		required: true,
	},
	text_password: {
		type: String,
		required: true,
	},
    type:{
        type: String, 
		enum: ['Meta', 'Admin']
    },
	status:{
		type: String, 
		enum: ['Active', 'Deleted', 'Blocked']
	}

}, { timestamps: { createdAt: 'created_at' }});

const admin = mongoose.model('Admin', AdminSchema);
exports.Admin = admin;
