import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    sender : {type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    reciver : {type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    message : { type : String , required : true }

})

const Message = mongoose.model("Message",messageSchema);
export default Message