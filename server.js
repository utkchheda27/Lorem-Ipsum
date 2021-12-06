import * as http from 'http';
import express from "express";
import mongoose from "mongoose";
import { homepageHandler, getPosts, createPostHandler } from './controllers/homepage.js';
import path from "path"; // path
import session from "express-session";
import flash from "connect-flash";
import methodOverride from "method-override";
import passport from "passport";
import User from "./models/user.js";
import Comment from "./models/commentModel.js";
import Post from "./models/postSchema.js";
import LocalStrategy from "passport-local";
import userRoutes from "./routes/users.js";
import friendsRoutes from "./routes/friends.js";
import { isLoggedIn } from "./middlewares.js";
import requestRoutes from "./routes/requests.js";
import { Server } from 'socket.io';
import dotenv from "dotenv";
import ExpressError from "./utilities/ExpressError.js";
import catchAsync from "./utilities/catchAsync.js";
dotenv.config();
const __dirname = path.resolve();
import * as signature from 'cookie-signature';
import * as cookie from 'cookie';
import { storage } from "./cloudinary/posts.js"
import multer from "multer"
const upload = multer({ storage })
import MongoStore from 'connect-mongo'
import { getDateAndTime } from './utilities/getDateAndTime.js';
// initializing app instance
const app = express()
const server = http.createServer(app);
const io = new Server(server);




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

const secret = process.env.SESSION_SECRET || "H7wVAqN5ZXE4uGNTWDTlKtQF1DEQVbLC";

const store = MongoStore.create({ mongoUrl: process.env.DB_ACCESS_LINK, touchAfter: 7 * 24 * 3600 })

const sessionConfig = {

    name: "session",
    secret,
    resave: false,
    store,
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

let onlineUsers = {}


io.on('connection', function (socket) {
    let username = '';
    if (socket.handshake && socket.handshake.headers && socket.handshake.headers.cookie) {
        var raw = cookie.parse(socket.handshake.headers.cookie)['session'];
        if (raw) {
            socket.sessionId = signature.unsign(raw.slice(2), process.env.SESSION_SECRET) || undefined;
        }
    }
    if (socket.sessionId) {
        store.get(socket.sessionId, function (err, session) {
            username = session.passport.user;
            socket['username'] = session.passport.user;
            onlineUsers[String(socket.id)] = username
        });
    }
    socket.on('message', ({ message }) => {
        socket.broadcast.emit('newMessage', { message })
    })
    socket.on('disconnect', () => {
        socket.broadcast.emit('userDisconnected')
        delete onlineUsers[socket.id]
    })
});

const port = 4000;

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash("error");
    next();
}) //enabling contents of flash file




app.use('/user/:id/requests', requestRoutes)
app.use('/', userRoutes)
app.use('/user/:id/friends', friendsRoutes)
app.post('/post', isLoggedIn, upload.array('images'), createPostHandler)
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

app.get('/friends', isLoggedIn, (req, res) => {
    res.render('friends')
})

app.get('/posts', async (req, res) => {
    const { id } = req.query
    const user = await User.findById(id);
    const tempPosts = []
    for (let post of user.posts) {
        let tPost = await Post.findById(post).populate('User')
        const comments = []
        for (let commentId of tPost.comments) {
            const tComment = await Comment.findById(commentId).populate('author')
            comments.push(tComment)
        }
        tPost.comments = comments
        tempPosts.push(tPost)
    }
    res.json({ status: true, posts: tempPosts })
})

app.post('/posts/:pId/comments', isLoggedIn, async (req, res) => {
    const post = await Post.findById(req.params.pId);
    const { commentBody } = req.body;
    const { date, time } = getDateAndTime()
    const tempComment = new Comment({ author: req.user, body: commentBody, date, time })
    const savedComment = await tempComment.save();
    post.comments.push(savedComment)
    const savedPost = await post.save()
    console.log(savedPost)
    res.json({ status: true, date, time })
})

app.get('/search', async (req, res) => {
    const { search_query: username } = req.query
    const users = await User.find({
        username: { $regex: `${username}`, $options: "$i" },
    });
    res.render('searchResult', { users })

})

app.get('/chat', isLoggedIn, (req, res) => {
    res.render('chat')
})

app.all('*', isLoggedIn, (req, res, next) => {
    throw new ExpressError("How did you get here ?", 404)
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Oh no something went wrong!!";
    res.status(statusCode).render("error", { err })
})

server.listen(port, () => {
    console.log(`App running on port ${port}`);
});
