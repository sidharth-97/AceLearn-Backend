import mongoose from "mongoose";
import ScheduleInterface from "../../useCases/interface/scheduleRepositoryInterface";
import { ScheduleModel } from "../database/ScheduleModel";
import { ObjectId } from "mongodb";

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
            from: "tutors",
            let: { tutorId: "$tutor" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$_id", "$$tutorId"] },
                },
              },
              {
                $project: {
                  password: 0,
                },
              },
            ],
            as: "tutorDetails",
          },
        },
        {
          $project: {
            password: 0,
          },
        },
      ]);

      console.log(schedules);
      return schedules;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async tutorSales(id: string) {
    const currentDate = new Date();
  
    const sales = await ScheduleModel.aggregate([
      {
        $match: {
          "timing.status": "booked",
          "timing.date": { $lt: currentDate },
        },
      },
      {
        $unwind: "$timing",
      },
      {
        $match: {
          "timing.status": "booked",
          "timing.date": { $lt: currentDate },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: { date: "$timing.date", timezone: "UTC" } },
            year: { $year: { date: "$timing.date", timezone: "UTC" } },
          },
          totalFee: { $sum: "$timing.fee" },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);
  
    return sales;
  }
   async studentTimeline(id: string): Promise<any> {
    const result = await ScheduleModel.aggregate([
      {
        $unwind: '$timing',
      },
      {
        $match: {
          'timing.status': { $in: ['booked', 'Booked'] },
        },
      },
      {
        $group: {
          _id: '$timing.date',
          totalClasses: { $sum: 1 },
        },
      },
      {
        $sort: { totalClasses: -1 },
      },
    ]);
    
     console.log(result,"result of the aggregation");
     if (result) {
       return result
     } else {
       return null
     }
     
  }

  async tutorAvailable(id: string) {
    console.log(id,"id");
    
    const schedule = await ScheduleModel.findOne({tutor:id})
    const available=schedule?.timing.find((item:any)=>item.status=="Not booked")
    if (available) {
      console.log(available,"here");
      
      return available
    } else {
      return null
  }
 
    
  }

}

export default ScheduleRepository;
