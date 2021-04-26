const mongoose = require('mongoose');

//simple schema
const MessageSchema = new mongoose.Schema({
	text: {
		type: String,
		required: true,
	},
	author: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User' 
	}
}, { timestamps: { createdAt: 'created_at' }});

const message = mongoose.model('Message', MessageSchema);
exports.Message = message;