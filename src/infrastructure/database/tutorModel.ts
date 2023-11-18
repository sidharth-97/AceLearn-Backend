
import mongoose, { Document, Schema,ObjectId } from "mongoose";

interface ITutor extends Document{
    _id: ObjectId,
    email: string,
    name:string,
    password: string,
    mobile: string,
    subject: Array<string>,
    fee: string,
    bio: string,
    image:string,
    isBlocked: Boolean,
    wallet: number,
    review: object,
    qualifications:string
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
    mobile:{
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
    qualifications: {
        type:String
    },
    isBlocked: {
        type:Boolean
    },
    wallet: {
        type: Number,
        default:0
    },
    review: [
        {
            student: {
                type:mongoose.Types.ObjectId,
                ref:"Student"
            },
            rating:{
                type:Number
            },
            description: {
                type:String
            }
        }
    ]
})

const TutorModel = mongoose.model<ITutor>("Tutor", TutorSchema)

export {TutorModel}