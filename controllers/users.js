import User from "../models/user.js"



export const renderRegister = (req, res) => {
    res.render("users/register")
}

export const register = async (req, res, next) => {
    try {
        console.log(req.file)
        const user = new User(req.body)
        user.profilePicture = req.file.path;
        const registeredUser = await User.register(user, req.body.password);
        console.log(registeredUser)
        req.login(registeredUser, err => {
            if (err) return next(err);
            const redirectUrl = req.session.returnTo || "/";
            console.log("redirectUrl => ", redirectUrl)
            delete req.session.returnTo;
            res.redirect(redirectUrl)
        })
        res.send('success')
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("register")
    }
}

export const renderLogin = (req, res) => {
    res.render("users/login")
}

export const login = (req, res) => {
    req.flash("success", "welcome back")
    const redirectUrl = req.session.returnTo || "/";
    console.log("redirectUrl => ", redirectUrl)
    delete req.session.returnTo;
    res.redirect(redirectUrl)
}

export const logout = (req, res) => {
    req.logout();
    res.redirect("/")
}