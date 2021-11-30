import Post from '../models/postSchema.js'
import User from '../models/user.js'

export const homepageHandler = (req, res) => {
    res.render("homepage");
}

export const getPosts = async (req, res) => {
    const pageNo = req.query.pageNo ? req.query.pageNo : 1;
    let data = await Post.find({}).limit(pageNo * 5).populate('User'); // 5 posts per page
    if (data.length < pageNo * 5) {
        return res.json({ posts: data, more: false })
    }
    res.json({ posts: data, more: true });
}

export const createPostHandler = async (req, res) => {
    const { caption, image } = req.body;
    const date = new Date;
    const dateN = `${date.getDate()}|${date.getMonth()}|${date.getFullYear()}`
    const time = `${date.getHours()}:${date.getMinutes()}`
    let tempPost = null;
    if (image)
        tempPost = new Post({ Description: caption, Images: [image], Username: req.user.username, User: req.user._id, Time: time, Date: dateN })
    else
        tempPost = new Post({ Description: caption, Username: req.user.username, User: req.user._id, Time: time, Date: dateN })
    const res1 = await tempPost.save();
    const user = await User.findById(req.user._id);
    user.posts.push(res1);
    await user.save();
    res.redirect('/')
}