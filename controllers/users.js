import User from "../models/user.js";
import ExpressError from "../utilities/ExpressError.js";
import catchAsync from "../utilities/catchAsync.js";

export const renderRegister = (req, res) => {
    res.render("users/register")
}

export const register = async (req, res, next) => {
    try {
        const user = new User(req.body)
        user.profilePicture = req.file.path;
        const registeredUser = await User.register(user, req.body.password);
        // console.log(registeredUser)
        req.login(registeredUser, err => {
            if (err) return next(err);
            const redirectUrl = req.session.returnTo || "/";
            // console.log("redirectUrl => ", redirectUrl)
            delete req.session.returnTo;
            return res.redirect(redirectUrl)
        })
        res.send('success')
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/auth/register")
    }
}

export const renderLogin = (req, res) => {
    res.render("users/login")
}

export const login = (req, res) => {
    // console.log(req.user._id)
    req.flash("success", "welcome back")
    const redirectUrl = req.session.returnTo || "/";
    // console.log("redirectUrl => ", redirectUrl)
    delete req.session.returnTo;
    res.redirect(redirectUrl)
}

export const logout = (req, res) => {
    req.logout();
    res.redirect("/")
}

export const updateUser = catchAsync(async (req, res) => {
    try {
        const { id } = req.params
        const { description = undefined, country = undefined, state = undefined, city = undefined, yearOfGraduation = undefined, branchInCollege = undefined, course = undefined, interests = undefined } = req.body;
        if (!id) {
            throw new ExpressError('id is not defined', 404);
        }
        if (String(id) !== String(req.user._id)) {
            throw ExpressError("Illegal operation", 401)
        }
        const user = await User.findById(id);
        if (!user) {
            throw ExpressError("User not found", 404);
        }

        if (description != undefined && description.trim()) {
            user.description = description.trim();
        }
        if (country != undefined && country.trim()) {
            user.country = country.trim()
        }
        if (state != undefined && state.trim()) {
            user.state = state.trim()
        }
        if (city != undefined && city.trim()) {
            user.city = city.trim()
        }
        if (yearOfGraduation != undefined) {
            user.yearOfGraduation = yearOfGraduation
        }
        if (branchInCollege != undefined && branchInCollege.trim()) {
            user.branchInCollege = branchInCollege.trim()
        }
        if (course != undefined && course.trim()) {
            user.course = course.trim()
        }
        if (interests != undefined) {
            const tempInterests = []
            for (let key in interests) {
                console.log(key)
                tempInterests.push(key)
            }
            user.interests = tempInterests
        }
        const updatedUser = await user.save();
        console.log(updatedUser)

        return res.redirect(`/user/${req.user._id}`)
    } catch (e) {
        throw new ExpressError(e.message, 500);
    }
})

export const deleteUser = async (req, res) => {
    // console.log('deleting user');
    try {
        const { id = undefined } = req.params
        if (id === undefined) {
            throw new ExpressError("id is required", 404);
        }
        const user = await User.findById(id);
        if (!user) {
            throw new ExpressError("User not found", 404);
        }
        console.log(req.user)
        const res1 = await User.findOneAndDelete({ _id: req.user._id });
        // console.log(res1);
        req.logout()
        res.redirect('/')
    } catch (e) {
        console.log(e.message)
    }
}
