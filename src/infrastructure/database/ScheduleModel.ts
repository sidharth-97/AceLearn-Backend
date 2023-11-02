import mongoose, { Schema, ObjectId } from "mongoose";

interface Schedule {
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

const ScheduleModel = mongoose.model('Schedule', ScheduleSchema);

export { Schedule, ScheduleModel };
