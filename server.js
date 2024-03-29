import * as http from 'http';
import express from "express";
import mongoose from "mongoose";
import { homepageHandler, friendsPageHandler, searchResult, setGlobelVariables } from './controllers/generalControllers.js';
import path from "path"; // path
import session from "express-session";
import flash from "connect-flash";
import passport from "passport";
import LocalStrategy from "passport-local";

import User from "./models/user.js";
import Message from "./models/Message.js"
import PersonalChat from './models/PersonalChat.js';

import userRouter from "./routes/user.js"
import authRouter from "./routes/auth.js";
import friendRouter from "./routes/friends.js";
import postRouter from "./routes/posts.js"
import commentRouter from "./routes/comments.js"
import chatRouter from "./routes/chat.js"
import apiRouter from "./routes/api.js"

import { isLoggedIn } from "./middlewares.js";
import ExpressError from "./utilities/ExpressError.js";
const __dirname = path.resolve();

import { Server } from 'socket.io';
import * as signature from 'cookie-signature';
import * as cookie from 'cookie';
import MongoStore from 'connect-mongo'

import methodOverride from "method-override"

import dotenv from "dotenv";
import user from './models/user.js';
dotenv.config();


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
app.use(methodOverride('_method'))

let onlineUsers = {}
io.on('connection', function (socket) {
    // console.log(socket.id)
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
            onlineUsers[username] = String(socket.id)
        });
    }

    socket.on("disconnect", () => {
        // console.log('Disconnected')
        delete onlineUsers[username]
        // console.log(onlineUsers)
    })
    socket.on('message', async ({ message, to, from, chatID = undefined }) => {
        const savedMessage = await Message.create({ text: message, author: from })
        const chat = await PersonalChat.findById(chatID)
        chat.messages.push(savedMessage._id)
        const savedChat = await chat.save()
        // // console.log(savedChat)
        // // console.log(savedMessage)
        socket.to(onlineUsers[to]).emit('new message', { message, date: new Date(), msgID: savedMessage._id })
    })

    socket.on('typing', ({ to = undefined }) => {
        socket.to(onlineUsers[to]).emit('friendTyping')
    })
});

const port = process.env.PORT || 4000;

app.use(setGlobelVariables) //enabling contents of flash file

app.get('/suggestions', async (req, res) => {
    try {
        let suggestions = new Map();

        for (let interset of req.user.interests) {
            let users = await User.find({ interests: interset });
            users = users.filter((u) => {
                if (String(req.user._id) === String(u._id) || req.user.friends.some((f) => String(f) === String(u._id))) {
                    return false
                } else {
                    return true
                }
            })
            users.forEach((u) => {
                suggestions.set(String(u._id), u)
            })
            if (suggestions.size >= 5) {
                break;
            }

        }
        let tempS = Array.from(suggestions.values());
        res.json({ status: true, suggestions: tempS })
    } catch (e) {
        console.log(e)
        res.json({ status: false, message: e.message })
    }
})

app.get("/", homepageHandler);
app.get('/friends', isLoggedIn, friendsPageHandler)
app.get('/search', isLoggedIn, searchResult)
app.use('/api', apiRouter)
app.use('/user/:id', userRouter)
app.use('/auth', authRouter)
app.use('/user/:id/friends', friendRouter)
app.use('/posts', postRouter)
app.use('/posts/:postID/comments', commentRouter)
app.use('/chats/', chatRouter)



app.all('*', isLoggedIn, (req, res, next) => {
    throw new ExpressError("How did you get here ?", 404)
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Oh no something went wrong!!";
    res.status(statusCode).render("error", { err })
})
// Test
server.listen(port, () => {
    console.log(`App running on port ${port}`);
});
