import express from "express"
import { getFriends, deleteFriend } from "../controllers/friends.js";
const router = express.Router({ mergeParams: true });
import { isLoggedIn } from "../middlewares.js"

router.get('/', isLoggedIn, getFriends)
router.delete('/:fid', isLoggedIn, deleteFriend)

export default router