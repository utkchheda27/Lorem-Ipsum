import User from "../models/user.js"

export const renderRegister = (req, res) => {
    res.render("users/register")
}

export const register = async (req, res, next) => {
    try {
        const { email, username, password, profilePicture = undefined } = req.body;
        let user = undefined;
        if (profilePicture)
            user = new User({ email, username, profilePicture });
        else
            user = new User({ email, username });
        const registeredUser = await User.register(user, password);

        req.login(registeredUser, err => {
            if (err) return next(err);
            const redirectUrl = req.session.returnTo || "/";
            console.log("redirectUrl => ", redirectUrl)
            delete req.session.returnTo;
            res.redirect(redirectUrl)
        })
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