import mongoose, { Document, Schema,ObjectId } from "mongoose";

interface ITutor extends Document{
    _id: ObjectId,
    email: string,
    name:string,
    password: string,
    mobileNo: string,
    subject: Array<string>,
    fee: string,
    bio: string,
    image:string,
    isBlocked:Boolean
}

const TutorSchema:Schema<ITutor> = new mongoose.Schema({
    email: {
        type: String,
        required:true
    },
    name: {
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
     fee: {
        type:String
    },
    bio:{
        type:String 
    },
    image: {
        type:String
    },
    isBlocked: {
        type:Boolean
    }
})

const TutorModel = mongoose.model<ITutor>("Tutor", TutorSchema)

export {TutorModel}