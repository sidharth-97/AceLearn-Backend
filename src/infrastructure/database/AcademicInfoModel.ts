import mongoose, { Document, Schema, ObjectId } from "mongoose";

interface academicInterface extends Document {
  subject: string[];
  class: string[];
}

const AcademicInfoSchema: Schema<academicInterface> = new mongoose.Schema({
  subject: [{ type: String }],
  class: [{ type: String }],
});

const AcademicInfoModel = mongoose.model<academicInterface>(
  "AcademicInfo",
  AcademicInfoSchema
);

export default AcademicInfoModel;
