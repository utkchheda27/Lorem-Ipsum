import mongoose from "mongoose";

const postSchema = {
  Images: {
    type: [String],
  },
  Description: {
    type: String,
    required: true,
  },
  Likes: {
    type: Number,
    default: 0,
  },
  Comments: {
    type: [String],
    default: [],
  },
  User: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  Date: {
    type: String,
    required: true,
  },
  Time: {
    type: String,
    required: true,
  }
};

export default mongoose.model("Post", new mongoose.Schema(postSchema));
