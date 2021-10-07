import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();
import User from "./models/userSchema.js";
import Post from "./models/postSchema.js";

mongoose.connect(process.env.DB_ACCESS_LINK);

mongoose.connection.on("error", (e) => {
  console.log(e.message);
});
mongoose.connection.once("open", () => {
  console.log("connected to db");
});

const app = express();

const port = 4000;

app.get("/api/posts", async (req, res) => {
  const data = await Post.find({});
  res.json(data);
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
