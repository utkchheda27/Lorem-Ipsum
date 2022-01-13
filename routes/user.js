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

router.put('/', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params
    const { description = undefined } = req.body;
    const user = await User.findById(id);
    if (description != undefined) {
        user.description = description.trim();
    }
    const updatedUser = await user.save();
    console.log(updatedUser)
    // const
    return res.redirect(`/user/${req.user._id}`)
}))

router.use('/requests', requestRoutes);

export default router