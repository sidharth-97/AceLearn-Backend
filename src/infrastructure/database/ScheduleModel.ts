import mongoose, { Schema, ObjectId, Document } from "mongoose";

interface Schedule extends Document {
    tutor: ObjectId; 
    timing: {
        date: Date;
        student: ObjectId;
    }[];
}

const ScheduleSchema = new Schema({
    tutor: {
        type: Schema.Types.ObjectId,
        ref: "Tutor"
    },
    timing: [{
        date: Date,
        student: Schema.Types.ObjectId
    }]
});

const ScheduleModel = mongoose.model<Schedule>('Schedule', ScheduleSchema);

export { Schedule, ScheduleModel };
