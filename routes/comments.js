import express from "express"
import { isLoggedIn } from "../middlewares.js";
const router = express.Router({ mergeParams: true })
import { addComment, deleteComment } from "../controllers/comments.js"

router.post('/', isLoggedIn, addComment)

router.delete('/:commentID', isLoggedIn, deleteComment)

export default router