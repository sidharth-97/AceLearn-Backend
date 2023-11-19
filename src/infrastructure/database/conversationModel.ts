import mongoose, { Document, Schema } from "mongoose";

interface Conversation extends Document {
    members: Array<string>;
}

const ConversationSchema = new Schema<Conversation>({
    members: {
        type:[String],
    }
}, { timestamps: true });

const ConversationModel = mongoose.model<Conversation>("Conversation", ConversationSchema);

export { Conversation, ConversationModel };
