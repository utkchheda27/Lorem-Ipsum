import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
const Schema = mongoose.Schema;

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

userSchema.plugin(passportLocalMongoose);

export default mongoose.model("User", userSchema);