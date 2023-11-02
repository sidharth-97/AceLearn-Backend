import ScheduleInterface from "../../useCases/interface/scheduleRepositoryInterface";
import { Schedule, ScheduleModel } from "../database/ScheduleModel";
import { ObjectId } from "mongoose";
import { Types, isValidObjectId } from "mongoose";


interface schedule{
    tutor: string,
    timing: {
        date: Date,
        student:any
    }
}

class ScheduleRepository implements ScheduleInterface {
    async pushDate(data:schedule): Promise<any> {

        console.log(data);
        
        let schedule = await ScheduleModel.findOne({ tutor: data.tutor });

        if (schedule) {
            console.log("inside schedule");
        
            const dateExists = schedule.timing.filter((time) => {
                // Convert both dates to timestamps for accurate comparison
                const timeDateTimestamp = time.date.getTime();
                const dataDateTimestamp = new Date(data.timing.date).getTime();
            
                // Compare the timestamps
                return timeDateTimestamp === dataDateTimestamp;
            });
                        console.log(dateExists);

            if (dateExists.length) {
                return schedule;
            } else {
              console.log("here1");
              
                  console.log(data.timing.student);
                  
                  // Push the new timing object into the 'timing' array
                  if (isValidObjectId(data.timing.student)) {
                    schedule.timing.push({
                        date: data.timing.date,
                        student:data.timing.student
                    });
                } else {
                    // Handle the case where the provided student is not a valid ObjectId
                }
                await schedule.save();
                return schedule
            }
        } else {
            console.log(data, "data");

            // const hasTiming = data.timing && data.timing.date && data.timing.student;

            // if (hasTiming) {
                const newSchedule = new ScheduleModel({
                    tutor: data.tutor,
                    timing: { date: new Date(data.timing.date), student: data.timing.student },
                });

                await newSchedule.save();
                return newSchedule
            // }
        }
    }

    async findById(id: string): Promise<any> {
    }
}

export default ScheduleRepository;
  
