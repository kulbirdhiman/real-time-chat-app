import expressAsyncHandler from "express-async-handler";
import Message from "../model/Message.js";
import Chat from "../model/Chat.js";
import User from "../model/User.js";
const sendMessage = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { message } = req.body;
  const userExists = await User.findById(id);
  if (!userExists) {
    return res.status(400).json({ message: "User does not exist" });
  }

  let chat = await Chat.findOne({
    users: { $all: [req.user._id, id] },
  })
    .populate("users", "-password")
    .populate({
      path: "messages",
      populate: {
        path: "sender",
        select: "-password",
      },
    });

  if (!chat) {
    chat = await Chat.create({
      users: [req.user._id, userExists._id],
      isGroupChat: false,
    });
  }

  const newMessage = await Message.create({
    sender: req.user._id,
    reciver: id,
    message,
  });

  if (newMessage) {
    chat.messages.push(newMessage);
  }
  const fullchat = await chat.save();
  res.json(chat);
});

const getAllchats = expressAsyncHandler(async (req, res) => {
  try {
    const allChats = await Chat.find({
      users: { $in: [req.user._id] },
    }).populate("users");
    console.log(allChats);
    res.json(allChats);
  } catch (error) {
    console.error("Error fetching chats:", error);
  }
});
export { sendMessage, getAllchats };
