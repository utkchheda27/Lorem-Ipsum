import mongoose from "mongoose";
import Post from "../models/postSchema.js";
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
  for (let i = 0; i < 51; i++) {
    const post = new Post({
      Images: [`https://cdn.mos.cms.futurecdn.net/6zicBixtUpfUHJYqcwrzmS-1024-80.jpg.webp`],
      Description: caption[Math.floor(Math.random() * caption.length)],
      Likes: 10 + Math.floor(Math.random() * 101),
      Comments: comments,
    });
    await post.save();
  }
};

seedApi();
