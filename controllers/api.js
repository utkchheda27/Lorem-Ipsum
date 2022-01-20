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
    try {
        const { chatID = undefined } = req.params;
        if (!chatID) {
            new ExpressError("chat doesn't exist", 404);
        }
        let unreadedMsgs = 0;
        let firstUnreadedMsg = undefined;
        const chatData = await PersonalChat.findById(chatID).populate({ path: 'participants' }).populate({ path: 'messages' })
        if (String(req.user._id) !== String(chatData.participants[0]._id) && String(req.user._id) !== String(chatData.participants[1]._id)) {

            throw new ExpressError("Illegal Operation", 401);
        }
        for (let msg of chatData.messages) {
            if (String(msg.author) !== String(req.user._id)) {
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
        // // console.log(chatData)
        res.json({ status: true, chatData, unreadedMsgs, firstUnreadedMsg });
    } catch (e) {
        res.json({ status: true, message: e.message })
    }
}

export const markMsgReaded = async (req, res) => {
    try {
        const { chatID = undefined, msgID = undefined } = req.params;
        let msg = await Message.findById(msgID);
        msg.isReaded = req.body.isReaded;
        await msg.save()
        res.json({ status: true });
    } catch (e) {
        res.json({ status: false, message: e.message })
    }
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
            if (tPost) {
                for (let commentId of tPost.comments) {
                    const tComment = await Comment.findById(commentId).populate('author')
                    if (tComment !== null && tComment.author !== null)
                        comments.push(tComment)
                }
                tPost.comments = comments
                tempPosts.push(tPost)
            }
        }
        resPost.push(...tempPosts);
    }
    res.json({ posts: resPost });
}

export const getAllMessages = async (req, res) => {
    const user = await User.findById(req.user._id).populate({
        path: "personalChats", populate: {
            path: 'messages'
        }
    });
    // // console.log(user)
    const chats = user.personalChats;
    let ans = 0;

    for (let chat of chats) {
        for (let message of chat.messages) {
            if (String(message.author._id) !== String(req.user._id) && message.isReaded === false) {
                ans++;
                break;
            }
        }
    }
    res.json({ status: true, noOfUnreadedChats: ans });
}