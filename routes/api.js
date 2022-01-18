import express from "express"
import { isLoggedIn } from "../middlewares.js"


import { getLoggedInUserInfo, getChatData, markMsgReaded, getPosts, getAllMessages } from "../controllers/api.js"

const router = express.Router({
    mergeParams: true
})

router.get('/loggedInUserInfo', isLoggedIn, getLoggedInUserInfo)

router.get('/chat', isLoggedIn, getAllMessages)

router.get('/chat/:chatID', isLoggedIn, getChatData)


router.put('/chat/:chatID/messages/:msgID', isLoggedIn, markMsgReaded)

router.get('/get_posts', isLoggedIn, getPosts)

export default router