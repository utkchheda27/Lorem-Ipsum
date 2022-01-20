import Post from "../models/postSchema.js";
import User from "../models/user.js";
import Comment from "../models/commentModel.js";
// import Cloud
import { storage } from "../cloudinary/posts.js"
import user from "../models/user.js";
import ExpressError from "../utilities/ExpressError.js";

export const deletePost = async (req, res, next) => {
    const { postID = undefined } = req.params
    // console.log("POSTID==>", postID)
    const post = await Post.findById(postID);
    if (String(post.User) !== String(req.user._id)) {
        next(new ExpressError("Illeagel Operation", 401))
    }
    const r = await Post.findByIdAndDelete(postID);
    res.redirect(`/user/${req.user._id}`);
}

export const getPosts = async (req, res) => {
    const { id } = req.query
    const user = await User.findById(id).populate({ path: "posts", populate: [{ path: 'comments', populate: 'author' }, { path: 'User' }] });
    // console.log("user => ", user.posts)
    res.json({ status: true, posts: user.posts })
}

export const createPostHandler = async (req, res) => {
    try {
        // console.log(req.files)
        const date = new Date;
        const dateN = `${date.getDate()}|${date.getMonth() + 1}|${date.getFullYear()}`
        const time = `${date.getHours()}:${date.getMinutes()}`
        const tempPost = new Post(req.body)
        // console.log(req.files)
        // const result = await storage.cloudinary.uploader.upload(req.files);
        for (let file of req.files) {
            const result = await storage.cloudinary.uploader.upload(file.path);
            // console.log(result)
        }
        tempPost.images = req.files.map(f => f.path);
        tempPost.User = req.user._id
        tempPost.time = time
        tempPost.date = dateN
        const res1 = await tempPost.save();
        // console.log(res1)
        const user = await User.findById(req.user._id);
        user.posts.push(res1);
        await user.save();
        res.redirect('/')
    } catch (e) {
        throw new ExpressError(e.message, 500);
    }
}

export const likePost = async (req, res) => {
    const post = await Post.findById(req.params.postID)
    post.likes.push({ author: req.user._id });
    const savedPost = await post.save();
    // console.log(savedPost.likes.length)
    res.json({ status: true, noOfLikes: savedPost.likes.length })
}

export const dislikePost = async (req, res) => {
    let post = await Post.findById(req.params.postID)
    post.likes = post.likes.filter((like) => {
        return String(like.author._id) !== String(req.user._id)
    })
    const savedPost = await post.save();
    res.json({ status: true, noOfLikes: savedPost.likes.length })
}