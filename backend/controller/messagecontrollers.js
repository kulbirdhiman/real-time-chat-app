import expressAsyncHandler from "express-async-handler";
import Message from "../model/Message.js";
import Chat from "../model/Chat.js";
import User from "../model/User.js";
const sendMessage = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { message } = req.body;
  console.log(message)
  console.log(id)
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
    })
      .populate("users", "-password") // Populate the users field, omitting the password
      .populate("messages") // Populate messages if you want to include message details
      .populate("isGroupAdmin", "name email"); // Populate group admin details if needed

    // console.log("Fetched chats:", allChats);
    res.status(200).json(allChats);
    // res.send("this is not working")
  } catch (error) {
    console.error("Error fetching chats:", error);
    res.status(500).json({ message: "Failed to fetch chats", error });
  }
});

export { sendMessage, getAllchats };
