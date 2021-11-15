import Post from '../models/postSchema.js'

export const homepageHandler = (req, res) => {
    res.render("homepage");
}

export const getPosts = async (req, res) => {
    const pageNo = req.query.pageNo ? req.query.pageNo : 1;
    const data = await Post.find({}).limit(pageNo * 5); // 5 posts per page
    if (data.length < pageNo * 5) {
        return res.json({ posts: data, more: false })
    }
    res.json({ posts: data, more: true });
}

export const createPostHandler = async (req, res) => {
    const { caption, image } = req.body;
    const tempPost = new Post({ Description: caption, Images: [image] })
    const res1 = await tempPost.save();
    res.redirect('/')
}