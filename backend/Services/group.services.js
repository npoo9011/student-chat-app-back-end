let { Group } = require('../Model/group.model');

exports.createGroup = async (query) => {
    const group = new Group(query);
    return await group.save()
}

exports.findOne = async (query) => {
    return await Group.findOne(query)
        .populate('members')
        .populate('owner')
        .populate('messages');
}

exports.findMembersGroups = async (query) => {
    return await Group.find(query)
        .populate('members')
        .populate('owner')
        .populate('messages');
}

exports.findAll = async () => {
    return await Group.find();
}

exports.addParticipant = async (groupId, member) => {
    const query = { _id: groupId };
    let update;
    if (member && typeof member == 'object') {
        update = { $push: { members: { $each: member } } };
    } else {
        update = { $push: { members: { $each: [member] } } };
    }
    return await Group.findOneAndUpdate(query, update, { new: true });
}

exports.removeParticipant = async (groupId, member) => {
    const query = { _id: groupId };
    const update = { $pull: { members: { $in: member } } };
    return await Group.findOneAndUpdate(query, update, { new: true, multi: true });
}

exports.exitGroup = async (groupId, owner) => {
    return await Group.findOneAndDelete({ _id: groupId, owner: owner });
}

exports.updatedGroup = async (query, update) => {
    return await Group.findOneAndUpdate(query, update, { new: true });

}