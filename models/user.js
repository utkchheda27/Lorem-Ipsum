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
        default: "https://thumbs.dreamstime.com/b/default-avatar-profile-trendy-style-social-media-user-icon-187599373.jpg"
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
    }],
    isDeleted: {
        type: Boolean,
        default: false
    }
})



userSchema.plugin(passportLocalMongoose);

export default mongoose.model("User", userSchema);