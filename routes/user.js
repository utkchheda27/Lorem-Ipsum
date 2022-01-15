import express from "express"
import { isLoggedIn } from "../middlewares.js";
import User from "../models/user.js";
import requestRoutes from "./requests.js"
import catchAsync from "../utilities/catchAsync.js";
import ExpressError from "../utilities/ExpressError.js";
const router = express.Router({ mergeParams: true });
import { updateUser } from "../controllers/users.js"

router.get('/', isLoggedIn, catchAsync(async (req, res, next) => {
    const { id } = req.params
    let user = await User.findById(id).populate('friends')
    if (!user) throw new ExpressError("User not found", 404)
    res.render('profilePage', { user })
}))

router.put('/', isLoggedIn, updateUser)

router.use('/requests', requestRoutes);

export default router