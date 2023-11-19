import mongoose, { Document, Schema } from "mongoose";

interface Message extends Document {
    conversationId: string,
    sender: string,
    text:string
}

const MessageSchema = new Schema<Message>({
    conversationId: {
        type: String,
    },
    sender: {
    type:String
    },
    text: {
        type:String
    },

}, { timestamps: true });

const MessageModel = mongoose.model<Message>("Message", MessageSchema);

export { Message, MessageModel };
