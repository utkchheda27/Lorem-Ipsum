import mongoose from "mongoose";


const likeSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }
})

const postSchema = {
  images: {
    type: [String],
  },
  caption: {
    type: String,
    required: true,
  },
  User: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  likes: [likeSchema],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment"
  }]
};

const Post = new mongoose.Schema(postSchema)

export default mongoose.model("Post", Post);
