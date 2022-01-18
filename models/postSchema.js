import mongoose from "mongoose";
import User from "./user.js";
import Comment from "./commentModel.js"

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

Post.post('findOneAndDelete', async (post) => {
  console.log("Deleting post")
  console.log(post)
  if (post) {
    for (let comment of post.comments) {
      const r1 = await Comment.findByIdAndDelete(comment);
      console.log(r1)
    }
    let user = await User.findById(post.User);
    user.posts = user.posts.filter((id) => {
      return String(id) !== String(post._id);
    })
    const r2 = await user.save();
    console.log(r2)
  }
})


export default mongoose.model("Post", Post);
