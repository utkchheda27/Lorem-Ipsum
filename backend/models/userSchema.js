import mongoose from "mongoose";

const userSchema = {
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  hashPassword: {
    type: String,
    required: true,
  },
};

export default mongoose.model("User", new mongoose.Schema(userSchema));
