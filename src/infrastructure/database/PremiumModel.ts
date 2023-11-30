import mongoose, { Document, Schema } from "mongoose"

interface Premium extends Document{
    student: Number,
    tutor:Number
}

const PremiumSchema = new Schema<Premium>({
    student: {
        type:Number
    },
    tutor: {
        type:Number
    }
})

const PremiumModel = mongoose.model<Premium>("Premium", PremiumSchema)

export {Premium,PremiumModel}