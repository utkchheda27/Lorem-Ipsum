import User from '../models/user.js'

export const setGlobelVariables = async (req, res, next) => {
    if (req.user) {
        const tempUser = await User.findById(req.user._id).populate({ path: 'personalChats', populate: { path: 'messages' } })
        res.locals.currentUser = tempUser;
    }
    res.locals.success = req.flash('success');
    res.locals.error = req.flash("error");
    next();
}

export const homepageHandler = (req, res) => {
    res.render("homepage");
}

export const friendsPageHandler = (req, res) => {
    res.render('friends')
}

export const searchResult = async (req, res) => {
    const { search_query: username } = req.query
    const users = await User.find({
        username: { $regex: `${username}`, $options: "$i" },
    });
    res.render('searchResult', { users })

}

