import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
const Schema = mongoose.Schema;
import Post from "./postSchema.js"

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    profilePicture: {
        type: String,
        default: "https://img.etimg.com/thumb/msid-50589035,width-650,imgsize-123073,,resizemode-4,quality-100/.jpg"
    },
    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'Post',
    }],
    savedPosts: [{
        type: Schema.Types.ObjectId,
        ref: 'Post',
    }],
    hidedPosts: [{
        type: Schema.Types.ObjectId,
        ref: 'Post',
    }],
    description: {
        type: String
    },
    country: {
        type: String
    },
    state: {
        type: String
    },
    city: {
        type: String
    },
    yearOfGraduation: {
        type: Number
    },
    branchInCollege: {
        type: String,
        enum: ["Civil Engineering", "Electrical Engineering", "Electronics Engineering", "Electronics", "Information Technology", "Mechanical Engineering", "Production Engineering", "Textile Engineering"]
    },
    course: {
        type: String,
        enum: ['B. Tech.', 'M. Tech.', 'Diploma', 'Ph. D.', "MCA"]
    },
    interests: {
        type: [String],
    },
    friends: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    requests: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    sentRequests: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    personalChats: [{
        type: Schema.Types.ObjectId,
        ref: "PersonalChat"
    }]
})

userSchema.post('findOneAndDelete', async (user) => {
    console.log("Deleting user")
    if (user) {
        for (let post of user.posts) {
            const res = await Post.findByIdAndDelete(post)
            // console.log(res);
        }
        for (let friendID of user.friends) {
            let friend = await userSchema.findById(friendID);
            friend.friends = friend.filter((f) => String(f) !== String(user._id));
            const res = await friend.save()
            // console.log(res);
        }

    }
})

userSchema.plugin(passportLocalMongoose);

export default mongoose.model("User", userSchema);