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
  reports: number,
  token:string
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
    default:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
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
  token: {
    type:String
  }
});

const TutorModel = mongoose.model<ITutor>("Tutor", TutorSchema);

export { TutorModel };
