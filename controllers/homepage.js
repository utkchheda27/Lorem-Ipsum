import Post from '../models/postSchema.js'
import User from '../models/user.js'
import Comment from "../models/commentModel.js"
export const homepageHandler = (req, res) => {
    res.render("homepage");
}

export const getPosts = async (req, res) => {
    const pageNo = req.query.pageNo ? req.query.pageNo : 1;
    const resPost = []
    for (let friendid of req.user.friends) {
        const friend = await User.findById(friendid)
        const tempPosts = []
        for (let post of friend.posts) {
            if (tempPosts.length >= 2 * pageNo) break;
            let tPost = await Post.findById(post).populate('User');
            const comments = []
            for (let commentId of tPost.comments) {
                const tComment = await Comment.findById(commentId).populate('author')
                comments.push(tComment)
            }
            tPost.comments = comments
            tempPosts.push(tPost)
        }
        resPost.push(...tempPosts);
    }
    res.json({ posts: resPost });
}

export const createPostHandler = async (req, res) => {
    console.log(req.files)
    const { caption, image } = req.body;
    const date = new Date;
    const dateN = `${date.getDate()}|${date.getMonth()}|${date.getFullYear()}`
    const time = `${date.getHours()}:${date.getMinutes()}`
    const tempPost = new Post(req.body)
    tempPost.images = req.files.map(f => f.path);
    tempPost.User = req.user._id
    tempPost.time = time
    tempPost.date = dateN
    const res1 = await tempPost.save();
    console.log(res1)
    const user = await User.findById(req.user._id);
    user.posts.push(res1);
    await user.save();
    res.redirect('/')
}