import mongoose from "mongoose"
const Schema = mongoose.Schema
import User from "./user.js"

const PersonalChatSchema = {
    participants: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    messages: [{
        type: Schema.Types.ObjectId,
        ref: "Message",
    }],
}

export default mongoose.model("PersonalChat", new Schema(PersonalChatSchema))