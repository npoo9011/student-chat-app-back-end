const mongoose = require('mongoose');

//simple schema
const GroupSchema = new mongoose.Schema({
	name: {
		type: String,
        unique: true,
	},
	about: {
		type: String
	},
    owner:{ type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	members: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'User' 
	}],
	messages:[{
        type: mongoose.Schema.Types.ObjectId, ref: 'Message' 
	}]
}, { timestamps: { createdAt: 'created_at' }});

const group = mongoose.model('Group', GroupSchema);
exports.Group = group;
