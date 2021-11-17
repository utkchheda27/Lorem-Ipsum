import express from "express";
import mongoose from "mongoose";

// import path from "path"; //
const __dirname = path.resolve();
import { homepageHandler, getPosts, createPostHandler } from './controllers/homepage.js';

//requiring modules and necessary files
import path from "path"; // path
import session from "express-session";
import flash from "connect-flash";
import methodOverride from "method-override"
import  passport from "passport";
import User from "./models/user.js";
import LocalStrategy from "passport-local"
import userRoutes from "./routes/users.js";
//uc


import dotenv from "dotenv";
dotenv.config({ path: 'ENV_FILENAME' });


const app = express();
console.log(process.env.DB_ACCESS_LINK)

mongoose.connect("mongodb+srv://Abhishek_Gupta:Dqg5Y8K71aZS8rgT@cluster0.332em.mongodb.net/myFirstDatabase?retryWrites=true&w=majority");

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

const secret="utkarsh";

const sessionConfig={

    name:"session",
    secret,
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        // secure:true,
        expires:
        Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7
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

app.use((req,res,next)=>{
  res.locals.currentUser=req.user;
  res.locals.success=req.flash('success');
  res.locals.error=req.flash("error");
     next();
  }) //enabling contents of flash file



app.use((err,req,res,next)=>{
  const {statusCode=500}=err;
  if(!err.message) err.message="Oh no something went wrong!!";
  res.status(statusCode).render("error",{err})
})

app.use('/',userRoutes)
app.post('/createPost', createPostHandler)
app.get("/", homepageHandler);
app.get('/get_posts', getPosts)


app.all("*", (req,res) => {
  res.status(404).render("error",{err : {}})
})

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
