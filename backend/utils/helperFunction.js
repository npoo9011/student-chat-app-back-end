const { Group } = require("../Model/group.model");
const { Chat } = require("../Model/chat.model");
const { Message } = require("../Model/message.model");

exports.createmessage = async (chatId, message, author) => {
  const newMessage = new Message({
    text: message,
    author: author,
  });

  const savedMessage = await newMessage.save();
  // $or
  // $and
  // $push
  const newchat = await Chat.findOneAndUpdate(
    { _id: chatId },
    { $push: { messages: { $each: [savedMessage] } } },
    { new: true }
  ).populate("messages");
  if (savedMessage && newchat) {
    return newchat.messages;
  } else {
    return false;
  }
};

exports.createGroupsMessage = async (groupId, message, author) => {
  const newMessage = new Message({
    text: message,
    author: author,
  });
  const savedMessage = await newMessage.save();
  const newgroupchat = await Group.findOneAndUpdate(
    { _id: groupId },
    { $push: { messages: { $each: [savedMessage] } } },
    { new: true }
  ).populate("messages");
  if (savedMessage && newgroupchat) {
    return newgroupchat.messages;
  } else {
    return false;
  }
};
