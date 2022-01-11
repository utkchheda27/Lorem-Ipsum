import Post from "../models/postSchema.js";
import Comment from "../models/commentModel.js";
import { getDateAndTime } from "../utilities/getDateAndTime.js";
export const addComment = async (req, res) => {
    const post = await Post.findById(req.params.postID);
    const { commentBody } = req.body;
    const { date, time } = getDateAndTime()
    const tempComment = new Comment({ author: req.user, body: commentBody, date, time })
    const savedComment = await tempComment.save();
    post.comments.push(savedComment)
    const savedPost = await post.save()
    res.json({ status: true, date, time, commentId: savedComment._id, commentsLength: savedPost.comments.length })
}

export const deleteComment = async (req, res) => {
    const { postID, commentID } = req.params
    const data = await Comment.findOneAndDelete({ '_id': commentID })
    let post = await Post.findById(postID)
    post.comments = post.comments.filter(comment => String(comment._id) !== String(commentID))
    console.log(post.comments)
    const t = await post.save();
    console.log(data)
    res.json({ status: true, commentsLength: post.comments.length })

}