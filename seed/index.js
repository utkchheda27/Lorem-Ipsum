import mongoose from "mongoose";
import Post from "../models/postSchema.js";
import User from "../models/user.js";
import Comment from "../models/commentModel.js"
const id = 1065376;
mongoose.connect(
  "mongodb://Abhishek_2:aorrbg_02@cluster0-shard-00-00.332em.mongodb.net:27017,cluster0-shard-00-01.332em.mongodb.net:27017,cluster0-shard-00-02.332em.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-ezvhz9-shard-0&authSource=admin&retryWrites=true&w=majority"
);

mongoose.connection.on("error", (e) => {
  // console.log(e.message);
});
mongoose.connection.once("open", () => {
  // console.log("connected to db");
});
// lenard -- 619e6a7d19ee6f42dd8722ab
//penny -- 619dd6e7604166e151fd8548
// joey -- 61a75c3f22c91c4a1aab3b04
const getDateAndTime = () => {
  const date = new Date;
  const dateN = `${date.getDate()}|${date.getMonth()}|${date.getFullYear()}`
  const time = `${date.getHours()}:${date.getMinutes()}`
  return { date: dateN, time }
}
const caption = [
  "You can regret a lot of things but you’ll never regret being kind",
  "Do whatever makes you happiest",
  "Perseverance pays… a lot!",
  "Stop. Look. Listen. Breathe",
  "Nature beckons and I must listen",
  "Immersing yourself in nature is enough to make anybody believe in the divine",
];
const { date, time } = getDateAndTime()
const comments = [{ body: "nice pic", author: '619e6a7d19ee6f42dd8722ab', date, time }, {
  body: "indeed!!", author: "619e6a7d19ee6f42dd8722ab", date, time
}, { body: "insightful!!", author: "619e6a7d19ee6f42dd8722ab", date, time }, { body: "how you doin'", author: '619e6a7d19ee6f42dd8722ab', time, date }];

const savedComments = []
const saveComments = async () => {
  await Comment.deleteMany({})
  for (let comment of comments) {
    const t = new Comment(comment)
    const s = await t.save()
    savedComments.push(s);
  }
}

// saveComments()
const seedApi = async () => {
  await Post.deleteMany({});
  const user = await User.findById("619dd6e7604166e151fd8548");
  const users = await User.find({});

  for (let user of users) {
    user.posts = []
    await user.save()
  }

  for (let i = 0; i < 10; i++) {
    const date = new Date;
    const dateN = `${date.getDate()}|${date.getMonth()}|${date.getFullYear()}`
    const time = `${date.getHours()}:${date.getMinutes()}`
    const post = new Post({
      images: [`https://cdn.mos.cms.futurecdn.net/6zicBixtUpfUHJYqcwrzmS-1024-80.jpg.webp`],
      caption: caption[Math.floor(Math.random() * caption.length)],
      likes: [{ author: "619e6a7d19ee6f42dd8722ab" }, { author: "61a75c3f22c91c4a1aab3b04" }],
      comments: savedComments,
      User: '619dd6e7604166e151fd8548',
      date: dateN,
      time: time
    });
    const tpost = await post.save();
    user.posts.push(tpost);
  }
  const tuser = await user.save();
  // console.log(tuser);
};

const clearComments = async () => {
  const allComments = await Comment.find({});
  for (let comment of allComments) {
    const res = await Comment.findByIdAndDelete(comment._id);
    // console.log(res);
  }
}

// seedApi();
clearComments()