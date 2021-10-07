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
  Commemt: {
    type: [String],
  },
};

export default mongoose.model("Post", new mongoose.Schema(postSchema));
