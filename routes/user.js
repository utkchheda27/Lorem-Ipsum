import express from "express"
import { isLoggedIn } from "../middlewares.js";
import User from "../models/user.js";
import requestRoutes from "./requests.js"
import catchAsync from "../utilities/catchAsync.js";
const router = express.Router({ mergeParams: true });

router.get('/', isLoggedIn, catchAsync(async (req, res, next) => {
    const { id } = req.params
    let user = await User.findById(id).populate('friends')
    if (!user) throw new ExpressError("User not found", 404)
    res.render('profilePage', { user })
}))

router.use('/requests', requestRoutes);

export default router