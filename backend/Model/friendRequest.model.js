const mongoose = require('mongoose');

//simple schema
const RequestSchema = new mongoose.Schema({
		sender: {
			type: mongoose.Schema.Types.ObjectId, ref: 'User'
		},
        receiver: {
			type: mongoose.Schema.Types.ObjectId, ref: 'User'
		},
		status:{
			type: String, 
			enum: ['Requested', 'Accepted', 'Rejected']
		}
	
}, { timestamps: { createdAt: 'created_at' }});

const request = mongoose.model('Request', RequestSchema);
exports.Request = request;
