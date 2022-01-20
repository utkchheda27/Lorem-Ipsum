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
    if (!req.isAuthenticated()) {
        return res.render('home');
    }
    return res.render('homepage')
}

export const friendsPageHandler = (req, res) => {
    res.render('friends')
}

export const searchResult = async (req, res) => {
    // const { search_query: username } = req.query
    // const users = await User.find({
    //     username: { $regex: `${username}`, $options: "$i" },
    // });
    console.log(req.query);
    const { username = undefined, email = undefined, country = undefined, state = undefined, city = undefined, branch = undefined, batch = undefined, course = undefined } = req.query;

    const result = {}
    if (username) {
        const users = await User.find({
            username: { $regex: `${username}`, $options: "$i" },
        });
        result["username"] = {
            queryName: username,
            res: users
        }
    }
    if (email) {
        const users = await User.find({
            email: { $regex: `${email}`, $options: "$i" },
        });
        result["email"] = {
            queryName: email,
            res: users
        }
    }
    if (country) {
        const users = await User.find({
            country: { $regex: `${country}`, $options: "$i" },
        });
        result["country"] = {
            queryName: country,
            res: users
        }
    }
    if (state) {
        const users = await User.find({
            state: { $regex: `${state}`, $options: "$i" },
        });
        result["state"] = {
            queryName: state,
            res: users,
        }
    }
    if (city) {
        const users = await User.find({
            city: { $regex: `${city}`, $options: "$i" },
        });
        result["city"] = {
            queryName: city,
            res: users
        }
    }
    if (branch) {
        const users = await User.find({
            branchInCollege: { $regex: `${branch}`, $options: "$i" },
        });
        result["branch"] = {
            queryName: branch,
            res: users
        }
    }
    if (course) {
        const users = await User.find({
            branchInCollege: { $regex: `${course}`, $options: "$i" },
        });
        result['course'] = {
            queryName: course,
            res: users
        }
    }
    if (batch) {
        const users = await User.find({
            yearOfGraduation: batch
        });
        result['batch'] = {
            queryName: batch,
            res: users
        }
    }
    console.log(result)
    res.render('searchResult', { result })

}

