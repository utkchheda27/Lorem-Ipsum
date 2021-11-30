import mongoose from "mongoose";
import Post from "../models/postSchema.js";
import User from "../models/user.js";
const id = 1065376;
mongoose.connect(
  "mongodb+srv://Abhishek_Gupta:Dqg5Y8K71aZS8rgT@cluster0.332em.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
);

mongoose.connection.on("error", (e) => {
  console.log(e.message);
});
mongoose.connection.once("open", () => {
  console.log("connected to db");
});

const caption = [
  "You can regret a lot of things but you’ll never regret being kind",
  "Do whatever makes you happiest",
  "Perseverance pays… a lot!",
  "Stop. Look. Listen. Breathe",
  "Nature beckons and I must listen",
  "Immersing yourself in nature is enough to make anybody believe in the divine",
];

const comments = ["nice pic", "indeed!!", "insightful!!", "how you doin'"];

const seedApi = async () => {
  await Post.deleteMany({});
  const user = await User.findById("619dd6e7604166e151fd8548");

  for (let i = 0; i < 10; i++) {
    const date = new Date;
    const dateN = `${date.getDate()}|${date.getMonth()}|${date.getFullYear()}`
    const time = `${date.getHours()}:${date.getMinutes()}`
    const post = new Post({
      Images: [`https://cdn.mos.cms.futurecdn.net/6zicBixtUpfUHJYqcwrzmS-1024-80.jpg.webp`],
      Description: caption[Math.floor(Math.random() * caption.length)],
      Likes: 10 + Math.floor(Math.random() * 101),
      Comments: comments,
      User: '619dd6e7604166e151fd8548',
      Date: dateN,
      Time: time
    });
    const tpost = await post.save();
    console.log(tpost);
    user.posts.push(tpost);
  }
  const tuser = await user.save();
  console.log(tuser);
};

seedApi();
