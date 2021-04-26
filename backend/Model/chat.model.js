const mongoose = require('mongoose');

//simple schema
const ChatSchema = new mongoose.Schema({
		messages: [{
			type: mongoose.Schema.Types.ObjectId, ref: 'Message'
		}],
		firstUser:{
			type: mongoose.Schema.Types.ObjectId, ref: 'User'	
		},
        secondUser:{
			type: mongoose.Schema.Types.ObjectId, ref: 'User'
        }
}, { timestamps: { createdAt: 'created_at' }});

const chat = mongoose.model('Chat', ChatSchema);
exports.Chat = chat;
