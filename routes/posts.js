import express from "express"
import { isLoggedIn } from "../middlewares.js"
const router = express.Router({ mergeParams: true })
import { storage } from "../cloudinary/posts.js"
import multer from "multer"
const upload = multer({ storage })
import { getPosts, createPostHandler, likePost, dislikePost } from "../controllers/posts.js"

router.get('/', isLoggedIn, getPosts)

router.post('/', isLoggedIn, upload.array('images'), createPostHandler)

router.post('/:postID/likes', isLoggedIn, likePost)

router.delete('/:postID/likes', isLoggedIn, dislikePost)

export default router