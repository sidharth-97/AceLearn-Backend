import mongoose, { Document, Schema, ObjectId } from "mongoose";

interface IStudents extends Document {
  _id: ObjectId;
  username: String;
  email: String;
  mobile: String;
  password: String;
  image: String;
  isBlocked: Boolean;
  wallet: Number;
  notifications: any;
  walletHistory: any;
  premium: boolean
  token:string
}

const studentSchema: Schema<IStudents> = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobile: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  image: {
    type: String,
  },
  premium: {
    type: Boolean,
    default:false
  },
  token: {
    type:String
  },
  wallet: {
    type: Number,
    default: 0,
  },
  walletHistory: [
    {
      title: {
        type: String,
      },
      amount: {
        type:Number
      },
      date: {
        type: Date,
        default: new Date(),
      },
      type: {
       type: String
      },
      details: {
        type:String
      },
    },
  ],
  notifications: [
    {
      title: {
        type: String,
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        required: true,
      },  time: {
        type: Date,
        default: new Date(),
      },
    },
  ],
});

const studentModel = mongoose.model<IStudents>("Student", studentSchema);

export { studentModel };
