const mongoose = require('mongoose');

//simple schema
const ReportUserSchema = new mongoose.Schema({
		reportedBy: {
			type: mongoose.Schema.Types.ObjectId, ref: 'User'
		},
        reportedUser: {
			type: mongoose.Schema.Types.ObjectId, ref: 'User'
		},
        issue:{
            type: String,
        },
		status:{
			type: String, 
			enum: ['Reported', 'Accepted', 'Rejected']
		}
	
}, { timestamps: { createdAt: 'created_at' }});

const reportUser = mongoose.model('ReportUser', ReportUserSchema);
exports.ReportUser = reportUser;
