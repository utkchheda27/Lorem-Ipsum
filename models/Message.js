import mongoose from "mongoose"
const Schema = mongoose.Schema

const messageSchema = new Schema({
    text: {
        type: String,
        required: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    date: {
        type: Date,
        default: new Date()
    },
    isReaded: {
        type: Boolean,
        default: false,
    }
})

export default mongoose.model("Message", messageSchema)