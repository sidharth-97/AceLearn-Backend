import mongoose, { Document, Schema, ObjectId } from "mongoose";

interface IAdmin extends Document{
    _id: ObjectId,
    email: string,
    password:string
}

const AdminSchema: Schema<IAdmin> = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique:true
    },
    password: {
        type: String,
        required:true
    }
})

const AdminModel = mongoose.model<IAdmin>("Admin", AdminSchema)

export default AdminModel