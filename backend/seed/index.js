import mongoose from "mongoose";
import Post from "../models/postSchema.js";

mongoose.connect(
  "mongodb+srv://Abhishek_Gupta:uMWzrKaZnuDrzI6k@cluster0.332em.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
);

mongoose.connection.on("error", (e) => {
  console.log(e.message);
});
mongoose.connection.once("open", () => {
  console.log("connected to db");
});

const id = 1065376;
const caption = [
  "You can regret a lot of things but you’ll never regret being kind",
  "Do whatever makes you happiest",
  "Perseverance pays… a lot!",
  "Stop. Look. Listen. Breathe",
  "Nature beckons and I must listen",
  "Immersing yourself in nature is enough to make anybody believe in the divine",
];

const seedApi = async () => {
  await Post.deleteMany({});
  for (let i = 0; i < 51; i++) {
    const post = new Post({
      Images: [`https://source.unsplash.com/collection/${id}/1600x900`],
      Description: caption[Math.floor(Math.random() * caption.length)],
      Likes: 10 + Math.floor(Math.random() * 101),
    });
    await post.save();
  }
};

seedApi();
