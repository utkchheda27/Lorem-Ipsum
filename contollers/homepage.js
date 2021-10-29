import Post from '../models/postSchema.js'

export const homepageHandler = (req, res) => {
    res.render("homepage");
}

export const getPosts = async (req, res) => {
    const pageNo = req.query.pageNo ? req.query.pageNo : 1;
    const data = await Post.find({}).limit(pageNo * 5); // 5 posts per page
    res.json({ posts: data });
}