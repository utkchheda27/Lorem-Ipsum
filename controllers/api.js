import PersonalChat from "../models/PersonalChat.js"
import Message from "../models/Message.js"
import User from "../models/user.js"
import Post from "../models/postSchema.js"
import Comment from "../models/commentModel.js"

export const getLoggedInUserInfo = (req, res) => {
    try {
        res.json({ loggedInuser: req.user, status: true })
    } catch (e) {
        res.json({ status: false, error: "Something went wrong" })
    }
}

export const getChatData = async (req, res) => {
    const { chatID = undefined } = req.params;
    let unreadedMsgs = 0;
    let firstUnreadedMsg = undefined;
    if (chatID) {
        const chatData = await PersonalChat.findById(chatID).populate({ path: 'participants' }).populate({ path: 'messages' })
        for (let msg of chatData.messages) {
            if (msg.author !== req.user._id) {
                if (msg.isReaded === false) {
                    if (firstUnreadedMsg === undefined) {
                        firstUnreadedMsg = msg._id
                    }
                    const temp = msg;
                    temp.isReaded = true;
                    unreadedMsgs++;
                    await temp.save();
                }
            }
        }
        console.log(chatData)
        res.json({ chatData, unreadedMsgs, firstUnreadedMsg });
    }
}

export const markMsgReaded = async (req, res) => {
    const { chatID = undefined, msgID = undefined } = req.params;
    let msg = await Message.findById(msgID);
    msg.isReaded = req.body.isReaded;
    await msg.save()
    res.json({ status: true });
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
                if (tComment != null)
                    comments.push(tComment)
            }
            console.log(comments)
            tPost.comments = comments
            tempPosts.push(tPost)
        }
        resPost.push(...tempPosts);
    }
    res.json({ posts: resPost });
}