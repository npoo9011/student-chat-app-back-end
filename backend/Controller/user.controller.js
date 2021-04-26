var UserService = require('../Services/user.services');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');

exports.createUser = async (req, res) => {
	try {
		let user = await UserService.getOneByEmail({ email: req.body.email });
		if (user) return res.status(200).json({ message: 'User already registered' });

		user = await UserService.createUser({
			user_name: req.body.user_name,
			password: req.body.password,
			email: req.body.email,
			status: 'Active'
		});

		return res.status(200).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			message: 'User Created Success',
		});
	} catch (error) {
		console.log('Error', error);
		return res.status(200).json({
			message: 'Internal Server Error',
			user: {}
		});
	}

};

exports.signIn = async (req, res) => {

	try {
		let user = await UserService.getOneByEmail({ email: req.body.email });
		if (!user) {
			return res.status(200).json({ message: 'Invalid Email' });
		} else if (user && (user.status == 'Deleted' || user.status == 'Blocked')) {
			return res.status(200).json({ message: 'User has been deleted or blcocked' });
		}
		const hash = user.password;
		bcrypt.compare(req.body.password, hash, function (err, result) {
			if (result) {
				const token = jwt.sign(
					{
						name: user.user_name,
						email: user.email,
						userId: user._id,
						userType: 'User'
					},
					config.get('myprivatekey')
				);
				return res.header('x-auth-token', token)
					.status(200)
					.json({
						message: 'Login Successfuly...!!!',
						token: token,
						Userdata: {
							name: user.user_name,
							email: user.email,
							userId: user._id,
						},
					});
			} else {
				return res.status(200).json({
					message: 'Wrong password',
				});
			}
		});
	} catch (error) {
		console.log('Error', error);
		return res.status(200).json({
			message: 'Internal Server Error',
			Userdata: {}
		});
	}

};

exports.updateUser = async (req, res) => {

	try {
		const updatedUser = await UserService.updateUser({ _id: req['userId'] }, req.body);
		return res.status(200).json({
			user: updatedUser,
			message: 'User Updated Success',
		});

	} catch (error) {
		console.log('Error', error);
		return res.status(200).json({
			message: 'Internal Server Error',
			user: {}
		});
	}



}

exports.getOneByID = async (req, res) => {

	try {
		const user = await UserService.getOneByID(req['userId']);
		return res.status(200).json({
			user: user,
			message: 'User found success',
		});
	} catch (error) {
		console.log('Error', error);
		return res.status(200).json({
			message: 'Internal Server Error',
			user: {}
		});
	}
}

exports.getOneByEmail = async (req, res) => {

	try {
		const user = await UserService.getOneByEmail({ email: req.params.email });
		if (user) {
			return res.status(200).json({
				user: user,
				message: 'User found success',
			});
		} else {
			return res.status(200).json({
				user: {},
				message: 'Can not found user by email',
			});
		}

	} catch (error) {
		console.log('Error', error);
		return res.status(200).json({
			message: 'Internal Server Error',
			user: {}
		});
	}
}

exports.getAll = async (req, res) => {
	try {
		const userList = await UserService.getAllUsers();
		return res.status(200).json({
			userList,
			message: 'Users found success',
		});
	} catch (error) {
		console.log('Error', error);
		return res.status(200).json({
			message: 'Internal Server Error',
			userList: []
		});
	}
}

exports.getAllReported = async (req, res) => {
	try {
		const userList = await UserService.getManyUsers({ status: 'Reported' });
		return res.status(200).json({
			userList,
			message: 'Reported Users found success',
		});
	} catch (error) {
		console.log('Error', error);
		return res.status(200).json({
			message: 'Internal Server Error',
			userList: []
		});
	}
}

exports.deleteUser = async (req, res) => {
	try {
		// console.log("req.body",req.body);
		// let user = await UserService.getOneByEmail({ email: req.body.email });
		// console.log('hhj',user);
		// if (!user) {
		// 	return res.status(200).json({ message: 'Invalid Email' });
		// }
		// const hash = user.password;
		// bcrypt.compare(req.body.password, hash, async function (err, result) {
		// 	if (result) {
		// 		try {
			const updatedUser = await UserService.updateUser({ _id: req['userId'], }, { status: 'Deleted' });
			return res.status(200).json({
				user: updatedUser,
				message: 'User Deleted Success',
			});
				// } catch (error) {

				// 	return res.status(200).json({
				// 		message: 'Can not delte user server error',
				// 		error: error
				// 	});
				// }
		// 	} else {
		// 		return res.status(200).json({
		// 			message: 'Wrong password',
		// 		});
		// 	}
		// });
	} catch (error) {
		console.log('Error', error);
		return res.status(200).json({
			message: 'Internal Server Error',
			user: {}
		});
	}

}

exports.updatePassword = async (req, res) => {

	try {
		let { oldPassword, newPassword } = req.body;
		let user = await UserService.getOneByID(req['userId']);
		if (!user) {
			return res.status(200).json({ message: 'Invalid User Id' });
		}
		const hash = user.password;
		bcrypt.compare(oldPassword, hash, async function (err, result) {
			if (result) {

				const password = await bcrypt.hash(newPassword, 10);

				try {

					const updatedUser = await UserService.updateUser({ _id: req['userId'] }, { password });
					return res.status(200).json({
						user: updatedUser,
						message: 'User Password Updated Success',
					});

				} catch (error) {

					return res.status(200).json({
						message: 'Can not update user password server error',
						error: error
					});
				}

			} else {
				return res.status(200).json({
					message: 'Wrong Old Password',
				});
			}
		});
	} catch (error) {
		console.log('Error', error);
		return res.status(200).json({
			message: 'Internal Server Error',
			user: {}
		});
	}



}

exports.createFriendRequest = async (req, res) => {

	try {
		const { sender, receiver } = req.body;
		const frindrequests = await UserService.findFriendRequests({ sender, receiver });
		if (frindrequests && frindrequests.length > 0) {
			return res.status(200).json({
				message: 'Request already created',
			});
		}
		const request = await UserService.createRequest({ sender, status: "Requested", receiver });
		if (request && request._id) {
			const updatedUser = await UserService.addRequest(receiver, request._id);
			if (updatedUser) {
				return res.status(200).json({
					message: 'User Friend Request created success',
				});
			} else {
				return res.status(200).json({
					message: 'Receiver not found can not create Request',
				});
			}

		} else {
			return res.status(200).json({
				message: 'User not found can not create Request',
			});
		}
	} catch (error) {
		console.log('Error', error);
		return res.status(200).json({
			message: 'Internal Server Error',
		});
	}
}

exports.acceptFriendRequest = async (req, res) => {

	try {
		const { requestId, userId } = req.body;
		const user = await UserService.getOneByID(userId);
		if (user) {
			const requestalready = await UserService.findFriendRequests({
				_id: requestId,
				$or: [{ status: 'Rejected' }, { status: 'Accepted' }]
			});
			if (requestalready && requestalready.length > 0) {
				return res.status(200).json({
					message: 'Request already Accepted  or Rejected',
				});
			}
			const updatedFriendReuest = await UserService.updateRequestStatus(requestId, 'Accepted');
			if (updatedFriendReuest) {
				const sender = updatedFriendReuest.sender;
				const updatedUser = await UserService.addFriend(userId, sender);
				const chat = await UserService.createChat({ firstUser: userId, secondUser: sender })
				return res.status(200).json({
					message: 'User added to friends list success',
				});

			} else {
				return res.status(200).json({
					message: 'Request not found ...',
				});
			}
		} else {
			return res.status(200).json({
				message: 'User not found ...',
			});
		}
	} catch (error) {
		console.log('Error', error);
		return res.status(200).json({
			message: 'Internal Server Error',
		});
	}

}

exports.rejectFriendRequest = async (req, res) => {

	try {
		const { requestId, userId } = req.body;
		const user = await UserService.getOneByID(userId);
		if (user) {

			const requestalready = await UserService.findFriendRequests({
				_id: requestId,
				$or: [{ status: 'Rejected' }, { status: 'Accepted' }]
			});

			if (requestalready && requestalready.length > 0) {
				return res.status(200).json({
					message: 'Request already Rejected or Accepted',
				});
			}

			const updatedFriendReuest = await UserService.updateRequestStatus(requestId, 'Rejected');

			if (updatedFriendReuest) {

				return res.status(200).json({
					message: 'Request Rejected Success',
				});

			} else {
				return res.status(200).json({
					message: 'Request not found ...',
				});
			}
		} else {
			return res.status(200).json({
				message: 'User not found ...',
			});
		}
	} catch (error) {
		console.log('Error', error);
		return res.status(200).json({
			message: 'Internal Server Error',
		});
	}

}

exports.removeFriend = async (req, res) => {
	try {
		const { friendId, userId } = req.body;
		const updatedUser = await UserService.removeFriend(userId, friendId);

		const chat = await UserService.findChat({
			$or: [{ firstUser: friendId, secondUser: userId }, { firstUser: userId, secondUser: friendId }]
		});

		if (chat) {
			const chatdeleted = await UserService.deleteChat(chat.__id);
		}
		if (updatedUser) {
			return res.status(200).json({
				message: 'User removed from friends list success',
			});
		} else {
			return res.status(200).json({
				message: 'User not found can not unfriend',
			});
		}
	} catch (error) {
		console.log('Error', error);
		return res.status(200).json({
			message: 'Internal Server Error',
		});
	}


}

exports.findFriendsRequests = async (req, res) => {

	try {
		const { senderId } = req.params;
		const friendRequestList = await UserService.findFriendRequests({ sender: senderId });
		if (friendRequestList && friendRequestList.length > 0) {
			return res.status(200).json({
				friendRequestList,
				message: 'Friends Requests found success',
			});
		} else {
			return res.status(200).json({
				message: 'Requests not found...',
			});
		}
	} catch (error) {
		console.log('Error', error);
		return res.status(200).json({
			message: 'Internal Server Error',
		});
	}


}

exports.findChat = async (req, res) => {
	try {
		const { userId, friendId } = req.body;
		const chat = await UserService.findChat({
			$or: [{ firstUser: friendId, secondUser: userId }, { firstUser: userId, secondUser: friendId }]
		});

		if (chat) {
			return res.status(200).json({
				chat: chat,
				message: 'Chat found success',
			});
		} else {
			return res.status(200).json({
				chat: chat,
				message: 'Chat not found ',
			});
		}
	} catch (error) {
		console.log('Error', error);
		return res.status(200).json({
			message: 'Internal Server Error',
		});
	}


}

exports.createReport = async (req, res) => {

	try {
		const { reportedBy, reportedUser, issue } = req.body;

		const userReports = await UserService.findReports({ reportedBy, reportedUser });

		if (userReports && userReports.length > 0) {
			return res.status(200).json({
				message: 'User  already reported',
			});
		}

		const report = await UserService.createReport({ reportedBy, status: "Reported", reportedUser, issue });

		if (report && report._id) {
			return res.status(200).json({
				report,
				message: 'User reported success',
			});
		} else {
			return res.status(200).json({
				report: {},
				message: 'Can not create report',
			});
		}
	} catch (error) {
		console.log('Error', error);
		return res.status(200).json({
			message: 'Internal Server Error',
		});
	}
}
