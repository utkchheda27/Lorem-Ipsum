import express from "express"
import User from "../models/user.js"
const router = express.Router({ mergeParams: true })


router.get('/', async (req, res) => {
    const user = await User.findById(req.user._id).populate({ path: 'personalChats', populate: [{ path: 'participants' }, { path: 'messages' }] })
    res.render('chatMenu', { user })
})

router.get('/:chatID', async (req, res) => {
    return res.render('chat')
})

export default router