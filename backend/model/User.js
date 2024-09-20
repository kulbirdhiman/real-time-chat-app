
import mongoose from "mongoose";

const userShecma = mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    // avtar: { type: String, required: true ,default : ""},
    password: { type: String, required: true },
  },
  { timestamps: true }
);
const User = await mongoose.model("User", userShecma);

export default User