import mongoose from "mongoose";
import ScheduleInterface from "../../useCases/interface/scheduleRepositoryInterface";
import { Schedule, ScheduleModel } from "../database/ScheduleModel";

interface schedule {
  tutor: string;
  timing: {
    date: Date;
    student: any;
  };
}

class ScheduleRepository implements ScheduleInterface {
  async pushDate(data: schedule): Promise<any> {
    console.log(data);

    let schedule = await ScheduleModel.findOne({ tutor: data.tutor });

    if (schedule) {
      console.log("inside schedule");

      const dateExists = schedule.timing.filter((time) => {
        // Convert both dates to timestamps for accurate comparison
        if (time.date && time.date instanceof Date) {
          const timeDateTimestamp = time.date.getTime();
          console.log(timeDateTimestamp, "time date stamp");

          const dataDateTimestamp = new Date(data.timing.date).getTime();
          console.log(dataDateTimestamp, "data date timestamp");
          // Compare the time difference in milliseconds
          const timeDifference = Math.abs(
            timeDateTimestamp - dataDateTimestamp
          );

          // Check if the time difference is within an hour (less than 3600000 milliseconds)
          const isWithinAnHour = timeDifference <= 3600000;
          return isWithinAnHour;
        }
        return false;
      });
      console.log(dateExists);

      if (dateExists.length) {
        return schedule;
      } else {
        console.log("here1");

        console.log(data.timing.student);

        // Push the new timing object into the 'timing' array

        schedule.timing.push({
          date: data.timing.date,
          student: data.timing.student,
        });

        // Handle the case where the provided student is not a valid ObjectId

        try {
          console.log(schedule, "schedule inside save");

          await schedule.save();
        } catch (error) {
          console.log(error);
        }
        return schedule;
      }
    } else {
      console.log(data, "data");

      // const hasTiming = data.timing && data.timing.date && data.timing.student;

      // if (hasTiming) {
      const newSchedule = new ScheduleModel({
        tutor: data.tutor,
        timing: {
          date: new Date(data.timing.date),
          student: data.timing.student,
        },
      });

      await newSchedule.save();
      return newSchedule;
      // }
    }
  }

  async findById(id: string): Promise<any> {
    const schedule = await ScheduleModel.findOne({ tutor: id });
    if (schedule) {
      return schedule;
    } else {
      return null;
    }
  }
  async save(schedule: Object): Promise<any> {
    try {
      const newSchedule = new ScheduleModel(schedule);
      await newSchedule.save();
    } catch (error) {
      console.log(error);
    }
  }
  async findSchedule(id: String): Promise<any> {
    try {
      const schedule = await ScheduleModel.find({ tutor: id });
      return schedule;
    } catch (error) {
      console.log(error);
    }
  }
  async findAll(id: string): Promise<any> {
    try {
      console.log(id);
      const stdId = new mongoose.Types.ObjectId(id);

      const schedules = await ScheduleModel.aggregate([
        {
          $unwind: "$timing",
        },
        {
          $match: {
            "timing.student": stdId,
          },
        },
        {
          $lookup: {
            from: "tutors", // The name of the Tutor collection
            let: { tutorId: "$tutor" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$_id", "$$tutorId"] },
                },
              },
              {
                $project: {
                  password: 0, // Excluding the password field in the tutorDetails array
                  // You can include fields that you need by setting them to 1
                },
              },
            ],
            as: "tutorDetails",
          },
        },
        {
          $project: {
            password: 0, // Excluding the password field in the ScheduleModel
            // You can include fields that you need by setting them to 1
          },
        },
      ]);

      console.log(schedules);
      return schedules;
    } catch (error) {
      console.log(error);
      // Handle error or throw it further for handling at a higher level
      throw error;
    }
  }
}

export default ScheduleRepository;
