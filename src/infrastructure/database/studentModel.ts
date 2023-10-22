import mongoose, { Document, Schema,ObjectId} from "mongoose";

interface IStudents extends Document{
    _id: ObjectId,
    username: String
    email: String,
    mobile: String,
    password:String
}

const studentSchema:Schema<IStudents> = new mongoose.Schema({
    username: {
        type: String,
        required:true,
    },
    email: {
        type: String,
        required: true,
        unique:true
    },
    mobile: {
        type: String,
        unique:true
    },
    password: {
        type: String,
        required:true
    }
})

const studentModel = mongoose.model<IStudents>("Student", studentSchema)

export { studentModel }