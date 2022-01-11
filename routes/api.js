import express from "express"
import { isLoggedIn } from "../middlewares.js"

import { getLoggedInUserInfo, getChatData, markMsgReaded, getPosts } from "../controllers/api.js"

const router = express.Router({
    mergeParams: true
})

router.get('/loggedInUserInfo', isLoggedIn, getLoggedInUserInfo)

router.get('/chat/:chatID', isLoggedIn, getChatData)

router.put('/chat/:chatID/messages/:msgID', markMsgReaded)

router.get('/get_posts', isLoggedIn, getPosts)

export default router