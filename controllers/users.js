import User from "../models/user.js";
import ExpressError from "../utilities/ExpressError.js";
import catchAsync from "../utilities/catchAsync.js";
import Post from "../models/postSchema.js"

export const renderRegister = (req, res) => {
    res.render("users/register")
}

const defaultUserProfilePicture = "https://www.seekpng.com/png/full/115-1150053_avatar-png-transparent-png-royalty-free-default-user.png"

export const register = async (req, res, next) => {
    try {
        const user = new User(req.body)
        if (req.file) {
            user.profilePicture = req.file.path;
        }
        const registeredUser = await User.register(user, req.body.password);
        console.log(registeredUser)
        req.login(registeredUser, err => {
            if (err) return next(err);
            setTimeout(() => {
                return res.redirect("/")
            }, 2000);
        })
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/auth/register")
    }
}

export const renderLogin = (req, res) => {
    res.render("users/login")
}

export const login = (req, res) => {
    setTimeout(() => {
        return res.redirect("/")
    }, 2000);
}

export const logout = (req, res) => {
    req.logout();
    setTimeout(() => {
        return res.redirect("/auth/login")
    }, 2000);
}

export const updateUser = catchAsync(async (req, res) => {
    try {
        const { id } = req.params
        const { description = undefined, country = undefined, state = undefined, city = undefined, yearOfGraduation = undefined, branchInCollege = undefined, course = undefined, interests = undefined } = req.body;
        const { deleteProfilePicture } = req.query;
        console.log(Boolean(deleteProfilePicture))
        if (!id) {
            throw new ExpressError('id is not defined', 404);
        }
        if (String(id) !== String(req.user._id)) {
            throw new ExpressError("Illegal operation", 401)
        }
        let user = await User.findById(id);
        if (!user) {
            throw new ExpressError("User not found", 404);
        }
        if (deleteProfilePicture) {
            user.profilePicture = 'https://thumbs.dreamstime.com/b/default-avatar-profile-trendy-style-social-media-user-icon-187599373.jpg';
        }
        if (req.file !== undefined) {
            user.profilePicture = req.file.path;
            const profileChangePost = new Post();
            profileChangePost.caption = "New Profile Picture"
            profileChangePost.images = [req.file.path]
            profileChangePost.User = req.user._id;
            const date = new Date;
            const dateN = `${date.getDate()}|${date.getMonth() + 1}|${date.getFullYear()}`
            const time = `${date.getHours()}:${date.getMinutes()}`
            profileChangePost.date = dateN
            profileChangePost.time = time
            const res1 = await profileChangePost.save()
            user.posts.push(res1._id)
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
        if (user) {
            for (let post of user.posts) {
                const res = await Post.findByIdAndDelete(post)
                console.log(res);
            }
            for (let friendID of user.friends) {
                let friend = await User.findById(friendID);
                friend.friends = friend.friends.filter((f) => String(f) !== String(user._id));
                const res = await friend.save()
                console.log(res);
            }

        }
        user.profilePicture = defaultUserProfilePicture;
        user.isDeleted = true
        user.friends = undefined
        user.interests = undefined
        user.course = undefined
        user.description = undefined
        user.country = undefined
        user.state = undefined
        user.city = undefined
        user.yearOfGraduation = undefined
        user.branchInCollege = undefined

        const res1 = await user.save();
        console.log(res1)
        // console.log(req.user)
        // const res1 = await User.findOneAndDelete({ _id: req.user._id });
        // console.log(res1);
        req.logout()
        res.redirect('/')
    } catch (e) {
        console.log(e.message)
        throw new ExpressError(e.message, 500);
    }
}
