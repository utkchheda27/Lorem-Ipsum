export const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', "You need to log in first")
        return res.redirect('/auth/login')
    }
    next()
}

export const isThisLoggedInUser = (req, res, next) => {
    const { id } = req.params;
    if (String(req.user._id) === String(id)) return next();
    res.json({ status: false, error: "Not Allowed" })
}
