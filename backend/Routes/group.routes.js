var express = require('express');
var GroupRouter = express.Router();
var auth = require('../utils/auth');

var GroupController = require('../Controller/group.controller');

GroupRouter.post('/',auth.verifyToken,GroupController.create);

GroupRouter.get('/mygroups',auth.verifyToken,GroupController.getMemberGroups);

GroupRouter.get('/all',auth.verifyToken,GroupController.findAll);

GroupRouter.get('/:groupId',auth.verifyToken,GroupController.findOne);

GroupRouter.post('/add/:groupId',auth.verifyToken,GroupController.addParticipants);

GroupRouter.post('/update/:groupId',auth.verifyToken,GroupController.updateGroup);

GroupRouter.post('/remove/:groupId',auth.verifyToken,GroupController.removeParticipants);

GroupRouter.delete('/:groupId',auth.verifyToken,GroupController.exitGroup);

module.exports = GroupRouter;