const { User } = require('../Model/user.model');
const { Request } = require('../Model/friendRequest.model');
const { Chat } = require('../Model/chat.model');
const { ReportUser } = require('../Model/userReports.model');
const bcrypt = require("bcrypt");


exports.getAllUsers = async function () {
    return await User.find();
}

exports.getManyUsers = async function (query) {
    return await User.find(query);
}

exports.createUser = async (query) => {
    const user = new User(query);
    user.password = await bcrypt.hash(user.password, 10);
    return await user.save();
};

exports.updateUser = async (query, data) => {

    return User.findOneAndUpdate(query, data, {
        new: true
    });
}

exports.getOneByEmail = async function (query) {

    return await User.findOne(query);

}

exports.getOneByID = async (userId) => {
    return await User.findById(userId)
        .populate({
            path: 'friendRequests',
            populate: {
                path: 'sender',
                model: 'User',
                select: 'user_name email about'
            }
        })
        .populate({ path: 'friends', select: 'user_name email about' })

}

exports.createRequest = async (data) => {
    const friendRequest = new Request(data);
    return await friendRequest.save();
}

exports.findFriendRequestById = async (requestId) => {
    return await Request.findById(requestId);
}

exports.findFriendRequests = async (query) => {

    return await Request.find(query).populate('receiver');
}

exports.updateRequestStatus = async (requestId, status) => {
    return await Request.findOneAndUpdate({ _id: requestId }, { status: status });
}

exports.addRequest = async (userId, requestId) => {
    const query = { _id: userId };
    const update = { $push: { friendRequests: { $each: [requestId] } } };
    return await User.findOneAndUpdate(query, update, { new: true });

}

exports.removeRequest = async (userId, requestId) => {
    const query = { _id: userId };
    const update = { $pull: { friendRequests: requestId } };
    return await User.findOneAndUpdate(query, update, { new: true });
}

exports.addFriend = async (userId, friendId) => {
    const query = { _id: userId };
    const update = { $push: { friends: { $each: [friendId] } } };
    const query1 = { _id: friendId };
    const update1 = { $push: { friends: { $each: [userId] } } };
    const updatedUser = await User.findOneAndUpdate(query, update, { new: true });
    const updatedFriend = await User.findOneAndUpdate(query1, update1, { new: true });
    return updatedUser;
}

exports.removeFriend = async (userId, friendId) => {
    const query = { _id: userId };
    const update = { $pull: { friends: friendId } };
    const query1 = { _id: friendId };
    const update1 = { $pull: { friends: userId } };
    const updatedUser = await User.findOneAndUpdate(query, update, { new: true });
    const updatedFriends = await User.findOneAndUpdate(query1, update1, { new: true });
    return updatedUser;
}

exports.createChat = async (data) => {
    const chat = new Chat(data);
    return await chat.save();
}

exports.deleteChat = async (chatId) => {
    return await Chat.findByIdAndDelete(chatId);
}

exports.findChat = async (query) => {
    return await Chat.findOne(query)
        .populate('messages')
        ;
}

exports.createReport = async (data) => {
    const report = new ReportUser(data);
    return await report.save();
}

exports.findReports = async (query) => {
    return await ReportUser.find(query)
        .populate({ path: 'reportedBy', select: 'user_name email status about' })
        .populate({ path: 'reportedUser', select: 'user_name email status about' })
}

