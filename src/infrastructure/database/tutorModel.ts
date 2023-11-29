import mongoose, { Document, Schema, ObjectId } from "mongoose";

interface ITutor extends Document {
  _id: ObjectId;
  email: string;
  name: string;
  password: string;
  mobile: string;
  subject: Array<string>;
  fee: string;
  bio: string;
  image: string;
  isBlocked: Boolean;
  wallet: number;
  review: object;
  qualifications: string;
  notifications: Array<object>;
  walletHistory: Array<object>;
  rating: number;
  premium: boolean;
  reports:number
}

const TutorSchema: Schema<ITutor> = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
  },
  subject: {
    type: [String],
    required: true,
  },
  fee: {
    type: String,
  },
  bio: {
    type: String,
  },
  image: {
    type: String,
  },
  qualifications: {
    type: String,
  },
  premium: {
    type: Boolean,
    default:false
  },
  isBlocked: {
    type: Boolean,
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
       type: Date
      } ,
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
      },
    },
  ],
  reports: {
    type: Number,
    default:0
  },
  rating: {
    type: Number,
  },
  review: [
    {
      student: {
        type: mongoose.Types.ObjectId,
        ref: "Student",
      },
      rating: {
        type: Number,
      },
      time: {
        type: Date,
        default: new Date(),
      },
      description: {
        type: String,
      },
    },
  ],
});

const TutorModel = mongoose.model<ITutor>("Tutor", TutorSchema);

export { TutorModel };
