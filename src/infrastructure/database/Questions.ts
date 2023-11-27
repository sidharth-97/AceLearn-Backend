import mongoose, { Schema, ObjectId, Document } from "mongoose";

interface Questions extends Document {
  student: string;
  subject: string;
  date: Date;
  image: string;
  description: string;
  tutor: string;
  solution: any;
}

const QuestionsSchema = new Schema<Questions>({
  student: {
    type: String,
  },
  subject: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  image: {
    type: String,
  },
  description: {
    type: String,
  },
  tutor: {
    type: String,
  },
  solution: {
    text: {
      type: String,
    },
    image: {
      type: String,
    },
  },
});

const QuestionsModel = mongoose.model<Questions>("Questions", QuestionsSchema);
export { Questions, QuestionsModel };
