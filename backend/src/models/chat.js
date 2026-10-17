import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
    {
        userMessage: {
            type: String,
            required: true
        },
        aiResponse: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
    

);

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;