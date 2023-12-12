import mongoose, { Document, Schema, ObjectId } from "mongoose"

interface liveClassInterface extends Document{
    tutor: ObjectId,
    date: Date,
    status: string,
    duration: string,
    fee: number,
    subject: string,
    topic: string,
    description: string,
    students?:string[]
}

const liveClassSchema: Schema<liveClassInterface> = new mongoose.Schema({
    tutor: {
        type: Schema.Types.ObjectId,
        ref:"Tutor"
    },
    date: {
        type: Date
    },
    status: {
        type: String
    },
    duration: {
        type: String
    },
    fee: {
        type:Number
    },
    subject: {
        type: String
    },
    topic: {
        type: String
    },
    description: {
        type: String
    },
    students:{
        type: [String]
    }
})

const liveClassModel = mongoose.model<liveClassInterface>("LiveClass", liveClassSchema);

export {liveClassModel,liveClassInterface}