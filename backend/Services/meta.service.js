const { Admin } = require('../Model/admin.model');
const { ReportUser } = require('../Model/userReports.model');

const bcrypt = require("bcrypt");


exports.getAllAdmins = async function () {
    return await Admin.find({ type: 'Admin' });
};

exports.getOneByID = async (userId) => {
    return await Admin.findById(userId);
};

exports.getOne = async (query) => {
    return await Admin.findOne(query);
};

exports.createAdmin = async (query) => {
    const admin = new Admin(query);
    admin.password = await bcrypt.hash(admin.password, 10);
    return await admin.save();
};

exports.updateAdmin = async (query, data) => {
    return Admin.findOneAndUpdate(query, data, {
        new: true
    });
};

exports.updateReportStatus = async (reportId, status) => {
    return await ReportUser.findOneAndUpdate({ _id: reportId }, { status: status }, { new: true });
}



