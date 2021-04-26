var express = require('express');
var UserRouter = express.Router();

var auth = require('../utils/auth');

var UserController = require('../Controller/user.controller');

UserRouter.get('/all',auth.verifyToken,UserController.getAll);

UserRouter.get('/all-reported',auth.verifyToken,UserController.getAllReported);

UserRouter.get('/email/:email',auth.verifyToken,UserController.getOneByEmail);

UserRouter.get('/friend-requests/:senderId',auth.verifyToken,UserController.findFriendsRequests);

UserRouter.get('/',auth.verifyToken,UserController.getOneByID);

UserRouter.post("/signup", UserController.createUser);

UserRouter.post("/signIn", UserController.signIn);

UserRouter.post('/create-request',auth.verifyToken,UserController.createFriendRequest);

UserRouter.post('/report-user',auth.verifyToken,UserController.createReport);

UserRouter.post('/accept-request',auth.verifyToken,UserController.acceptFriendRequest);

UserRouter.post('/reject-request',auth.verifyToken,UserController.rejectFriendRequest);

UserRouter.post("/find-chat", auth.verifyToken,UserController.findChat);

UserRouter.put("/update",auth.verifyToken,UserController.updateUser);

UserRouter.put("/update-password",auth.verifyToken,UserController.updatePassword);

UserRouter.delete("/remove-friend",auth.verifyToken,UserController.removeFriend);

UserRouter.delete("/",auth.verifyToken,UserController.deleteUser);


module.exports = UserRouter;