import mongoose, { Schema, ObjectId, Document } from "mongoose";

interface Job extends Document {
  student: ObjectId;
  subject: string;
  timeRange: string;
  class: string;
  requests: {
    tutor: ObjectId;
    fee: string;
    date: Date;
  };
}

const JobSchema = new Schema<Job>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "Student",
    },
    subject: {
      type: String,
    },
    timeRange: {
      type: String,
    },
    class: {
      type: String,
    },
    requests: [
      {
        tutor: {
            type: Schema.Types.ObjectId,
            ref: "Tutor", // Reference the Tutor model
          },
        fee: String,
        date: Date,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const JobModel = mongoose.model<Job>("Job", JobSchema);
export { Job, JobModel };
