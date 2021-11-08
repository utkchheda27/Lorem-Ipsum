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
};

export default mongoose.model("Post", new mongoose.Schema(postSchema));
