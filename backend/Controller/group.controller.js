let GroupService = require('../Services/group.services');

exports.create = async (req, res) => {
    try {
        const group = await GroupService.findOne({ name: req.body.name, owner: req.body.owner })
        if (group) {
            return res.status(200).json({
                group: {},
                message: 'Group already exists',
            });
        }
        const groupdata = await GroupService.createGroup(req.body);
        return res.status(200).json({
            group: groupdata,
            message: 'Group created success',
        });
    } catch (error) {
        console.log("error", error);
        return res.status(200).json({
            group: {},
            message: 'Internal Server error',
        });
    }


}
exports.findOne = async (req, res) => {
    try {
        const group = await GroupService.findOne({ _id: req.params.groupId });
        if (!group) {
            return res.status(200).json({
                group: {},
                message: 'Group  not found',
            });
        }
        return res.status(200).json({
            group: group,
            message: 'Group data found success',
        });
    } catch (error) {
        console.log("error", error);
        return res.status(200).json({
            group: {},
            message: 'Internal Server error',
        });
    }
}
exports.getMemberGroups = async (req, res) => {
    try {
        const userId = req['userId'];
        const query = { $or: [{ owner: userId }, { members: userId }] };
        const groupsList = await GroupService.findMembersGroups(query);

        if (groupsList && groupsList.length > 0) {
            return res.status(200).json({
                groupsList,
                message: 'User groups data found success',
            });
        } else {
            return res.status(200).json({
                groupsList: [],
                message: 'User groups data  not found',
            });
        }
    } catch (error) {
        console.log("error", error);
        return res.status(200).json({
            groupsList: {},
            message: 'Internal Server error',
        });
    }

}
exports.findAll = async (req, res) => {
    try {
        const groupList = await GroupService.findAll();

        if (groupList && groupList.length <= 0) {
            return res.status(200).json({
                message: 'Group List not found',
            });
        }
        return res.status(200).json({
            groupList,
            message: 'Groups data found success',
        });
    } catch (error) {
        console.log("error", error);
        return res.status(200).json({
            groupList: [],
            message: 'Internal Server error',
        });
    }
}
exports.addParticipants = async (req, res) => {
    try {
        const group = await GroupService.addParticipant(req.params.groupId, req.body.member);
        if (!group) {
            return res.status(200).json({
                group: {},
                message: 'Group not found can not added',
            });
        }
        return res.status(200).json({
            group: group,
            message: 'Participants added sucess',
        });
    } catch (error) {
        console.log("error", error);
        return res.status(200).json({
            group: {},
            message: 'Internal Server error',
        });
    }
}
exports.removeParticipants = async (req, res) => {
    try {
        const group = await GroupService.removeParticipant(req.params.groupId, req.body.member);
        if (!group) {
            return res.status(200).json({
                group: {},
                message: 'Group not found can not removed',
            });
        }
        return res.status(200).json({
            group: group,
            message: 'Participants removed sucess',
        });
    } catch (error) {
        console.log("error", error);
        return res.status(200).json({
            group: {},
            message: 'Internal Server error',
        });
    }
}
exports.exitGroup = async (req, res) => {
    try {
        const group = await GroupService.exitGroup(req.params.groupId, req.body.owner);
        if (!group) {
            return res.status(200).json({
                group: {},
                message: 'Group already deleted',
            });
        }
        return res.status(200).json({
            group: group,
            message: 'Group Deleted sucess',
        });
    } catch (error) {
        console.log("error", error);
        res.status(200).json({
            group: {},
            message: 'Internal Server error',
        });
    }
}
exports.updateGroup = async (req, res) => {
    try {
        const group = await GroupService.findOne({ _id: req.params.groupId });
        if (!group) {
            return res.status(200).json({
                group: {},
                message: 'Group  not found',
            });
        }

        const updateGroup = await GroupService.updatedGroup({ _id: req.params.groupId }, req.body);
        if (!group) {
            return res.status(200).json({
                group: {},
                message: 'Group could not updated',
            });
        }
        return res.status(200).json({
            group: updateGroup,
            message: 'Group data updated success',
        });
    } catch (error) {
        console.log("error", error)
        res.status(200).json({
            group: {},
            message: 'Internal Server error',
        });
    }
}
