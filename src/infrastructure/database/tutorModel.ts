import mongoose, { Document, Schema,ObjectId } from "mongoose";

interface ITutor extends Document{
    _id: ObjectId,
    email: string,
    password: string,
    mobileNo: string,
    subject: Array<string>,
    fee: string,
    isBlocked:Boolean
}

const TutorSchema:Schema<ITutor> = new mongoose.Schema({
    email: {
        type: String,
        required:true
    },
    password: {
        type: String,
        required:true
    },
    mobileNo:{
        type:String
    },
    subject: {
        type: [String],
        required:true
    },
    isBlocked: {
        type:Boolean
    }
})

const TutorModel = mongoose.model<ITutor>("Tutor", TutorSchema)

export {TutorModel}