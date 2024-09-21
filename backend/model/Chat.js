import mongoose from "mongoose";

const chatSchema = mongoose.Schema(
  {
    chatname: { type: String, },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    isGropChat: { type: Boolean, default: false },
    messages : [{type : mongoose.Schema.Types.ObjectId ,
      ref : "Message"
    }],
    isGroupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
