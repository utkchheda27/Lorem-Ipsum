import express from "express";
import mongoose from "mongoose";
import Post from "./models/postSchema.js";
import path from "path";
const __dirname = path.resolve();
import { homepageHandler, getPosts, createPostHandler } from './contollers/homepage.js';

const app = express();

import dotenv from "dotenv";
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
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "public")));

const port = 4000;

app.post('/createPost', createPostHandler)
app.get("/", homepageHandler);
app.get('/get_posts', getPosts)

app.get("/user/:id", (req, res) => {
  res.render('profilePage')
})

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
