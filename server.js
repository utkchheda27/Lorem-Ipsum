import express from "express";
import mongoose from "mongoose";
import { homepageHandler, getPosts, createPostHandler } from './controllers/homepage.js';
import path from "path"; // path
import session from "express-session";
import flash from "connect-flash";
import methodOverride from "method-override"
import passport from "passport";
import User from "./models/user.js";
import LocalStrategy from "passport-local"
import userRoutes from "./routes/users.js";
//uc
import { isLoggedIn, isThisLoggedInUser } from "./middlewares.js";

const __dirname = path.resolve();

const app = express();

import dotenv from "dotenv";
import ExpressError from "./utilities/ExpressError.js";
import catchAsync from "./utilities/catchAsync.js";
dotenv.config();
mongoose.connect(process.env.DB_ACCESS_LINK);

mongoose.connection.on("error", (e) => {
    console.log(e.message);
});
mongoose.connection.once("open", () => {
    console.log("connected to db");
});

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views")); // path
app.use(methodOverride("_method"))
app.use(express.static(path.join(__dirname, "public")));

const secret = "b099f91928f0b117e7abacded6777ddca25d3027";

const sessionConfig = {

    name: "session",
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires:
            Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};


app.use(session(sessionConfig));
app.use(flash());

//using passport to enable authentication,order in which files are used matters.ALERT!!
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const port = 4000;

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash("error");
    next();
}) //enabling contents of flash file




app.use('/', userRoutes)
app.post('/post', isLoggedIn, createPostHandler)
app.get("/", isLoggedIn, homepageHandler);
app.get('/get_posts', isLoggedIn, getPosts)

app.get("/user/:id", isLoggedIn, catchAsync(async (req, res, next) => {
    const { id } = req.params
    const user = await User.findById(id).populate('posts').populate('friends')
    if (!user) throw new ExpressError("User not found", 404)
    res.render('profilePage', { user })
}))


app.get('/loggedInUserInfo', isLoggedIn, (req, res) => {
    try {
        res.json({ loggedInuser: req.user, status: true })
    } catch (e) {
        res.json({ status: false, error: "Something went wrong" })
    }
})



app.get('/user/:id/friends', isLoggedIn, async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findById(id).populate('friends')
        if (!user) return res.json({ status: false, error: "User doesn't exist" })
        return res.json({ status: true, friends: user.friends })
    } catch (e) {
        console.log(e.message)
        return res.json({ status: false, error: "Something Went wrong" })
    }
})



app.delete('/user/:id/friends/:fid', isLoggedIn, isThisLoggedInUser, async (req, res) => {
    try {
        const { id, fid } = req.params
        if (String(id) === String(fid)) return res.json({ status: false, error: "Illegal Operation" })
        const f1 = await User.findById(id);
        const f2 = await User.findById(fid);
        if (!f1 || !f2) return res.json({ status: false, error: "User not found" })
        f1.friends = f1.friends.filter((id1) => String(id1) !== String(fid));
        f2.friends = f2.friends.filter((id1) => String(id1) !== String(id));
        const res1 = await f1.save();
        const res2 = await f2.save();
        console.log(res1, res2);
        res.json({ status: true });
    } catch (e) {
        console.log(e.message)
        res.json({ status: false, error: "Something Went wrong" })
    }
})



app.get('/user/:id/requests', isLoggedIn, isThisLoggedInUser, async (req, res) => { // sends all the requests recieved
    try {
        const { id } = req.params;
        const user = await User.findById(id).populate('requests');
        if (!user) return res.json({ status: true, error: "User doesn't exist" })
        const requests = user.requests
        res.json({ status: true, requests })
    } catch (e) {
        console.log(e.message)
        res.json({ status: false, error: "Something Went wrong" })
    }

})

app.post('/user/:id/requests/:fId', isLoggedIn, isThisLoggedInUser, async (req, res) => { // logged in user(id) sending request to a other user(fid)
    try {
        const { id: requesterId, fId: recipientId } = req.params // requester - sender && recipient - receiver
        console.log()
        if (String(requesterId) === String(recipientId)) return res.json({ status: false, error: "Illegal Operation" })
        const requester = await User.findById(requesterId);
        const recipient = await User.findById(recipientId);
        if (!recipient || !requester) return res.json({ status: false, error: "User doesn't exist" })
        recipient.requests.push(requester);
        requester.sentRequests.push(recipient)
        const n = await recipient.save()
        const t = await requester.save()
        console.log("requester => ", t.username)
        console.log("recipient => ", n.username)
        res.json({ status: true })
    } catch (e) {
        console.log(e.message, "\n", e.stack)
        res.json({ status: false, error: "Something Went wrong" })
    }
})


app.post('/user/:id/requests/:fId/response', isLoggedIn, isThisLoggedInUser, async (req, res) => { // logged in user(id) responding to a particular request(fid)
    try {
        const { id: recipientId, fId: requesterId } = req.params
        console.log(req.params)
        const { status } = req.body;
        if (String(recipientId) === String(requesterId)) return res.json({ status: false, error: "Illegal Operation" })
        const recipient = await User.findById(recipientId)
        const requester = await User.findById(requesterId)
        if (!recipient && !requester) return res.json({ status: false, error: "User not found" })
        if (status) {
            recipient.friends.push(requesterId);
            requester.friends.push(recipientId)
        }
        recipient.requests = recipient.requests.filter(id => String(id) !== String(requesterId))
        requester.sentRequests = requester.sentRequests.filter(id => String(id) !== String(recipientId))
        const req1 = await requester.save()
        const rec = await recipient.save()
        console.log(rec)
        console.log(req1)
        return res.json({ status: true })
    } catch (e) {
        console.log(e.message)
        res.json({ status: false, error: "Something Went wrong" })
    }
})

app.get('/user/:id/requests/sent', isLoggedIn, isThisLoggedInUser, async (req, res) => { // responds with all the requests made by user
    try {
        const { id } = req.params
        const user = await User.findById(id).populate("sentRequests");
        if (!user) return res.json({ status: false, error: "User doesn't exist" })
        console.log("sentRequests => " + user.sentRequests)
        res.json({ status: true, sentRequests: user.sentRequests })
    } catch (e) {
        console.log(e.message)
        res.json({ status: false, error: "Something Went wrong" })
    }
})


app.delete('/user/:id/requests/sent/:fid', isLoggedIn, isThisLoggedInUser, async (req, res) => { // deletes a request sent by a user(fid)
    try {
        const { id, fid } = req.params;
        if (String(id) === String(fid)) return res.json({ status: false, error: "Illegal Operation" })
        const sender = await User.findById(id);
        const receiver = await User.findById(fid);
        if (!sender || !receiver) return res.json({ status: false, error: "User doesn't exist" })
        sender.sentRequests = sender.sentRequests.filter(id1 => String(id1) !== String(fid))
        receiver.requests = receiver.requests.filter(id1 => String(id1) !== String(id));
        const newReceiver = await receiver.save()
        const newSender = await sender.save();
        console.log(newReceiver, newSender)
        res.json({ status: true })
    } catch (e) {
        console.log(e.message)
        res.json({ status: false, error: "Something Went wrong" })
    }
})


app.get('/friends', isLoggedIn, (req, res) => {
    res.render('friends')
})



app.all('*', isLoggedIn, (req, res, next) => {
    throw new ExpressError("How did you get here ?", 404)
})



app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Oh no something went wrong!!";
    res.status(statusCode).render("error", { err })
})


app.listen(port, () => {
    console.log(`App running on port ${port}`);
});
