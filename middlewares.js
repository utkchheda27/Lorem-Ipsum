export const isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl
        return res.redirect("/login")
    }
    next();
}

export const isThisLoggedInUser = (req, res, next) => {
    const { id } = req.params;
    if (String(req.user._id) === String(id)) return next();
    res.json({ status: false, error: "Not Allowed" })
}