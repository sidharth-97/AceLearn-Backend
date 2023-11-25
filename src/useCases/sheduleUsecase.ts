import PaymentRepository from "../infrastructure/repository/paymentRepository";
import ScheduleRepository from "../infrastructure/repository/scheduleRepository";
import studentRepository from "../infrastructure/repository/studentRepository";
import TutorRepository from "../infrastructure/repository/tutorRepository";

interface schedule {
  tutor: string;
  timing: {
    date: Date;
    student: string;
  };
}

class ScheduleUsecase {
  private ScheduleRepo: ScheduleRepository;
  private PaymentRepo: PaymentRepository
  private tutorRepo: TutorRepository
  private studentRepo:studentRepository
  constructor(ScheduleRepo: ScheduleRepository, PaymentRepo:PaymentRepository,tutorRepo:TutorRepository,studentRepo:studentRepository) {
    this.ScheduleRepo = ScheduleRepo;
    this.PaymentRepo = PaymentRepo
    this.tutorRepo = tutorRepo
    this.studentRepo=studentRepo
  }

  async scheduleTime(data: schedule) {
    const schedule = await this.ScheduleRepo.pushDate(data);


    if (schedule) {
      return {
        status: 200,
        data: schedule,
      };
    } else {
      return {
        status: 404,
        data: "Failed to add",
      };
    }
  }

  async changeSchedule(data: {
    tutor: string;
    timing: {
      date: Date;
      newDate: Date;
    };
  }) {
    const schedule = await this.ScheduleRepo.findById(data.tutor);

    if (schedule) {
      const updatedTiming = schedule.timing.filter(
        (time: { date: Date; newDate: Date }) => {
          const timeDateTimestamp = new Date(time.date).getTime();
          const dataDateTimestamp = new Date(data.timing.date).getTime();
          return timeDateTimestamp !== dataDateTimestamp;
        }
      );

      if (updatedTiming.length !== schedule.timing.length) {
        // Item was removed, update the schedule with the new timing array
        schedule.timing = updatedTiming;
        
        await this.ScheduleRepo.save(schedule);
        return {
          status: 200,
          data: schedule,
        };
      } else {
        // Date doesn't exist, no changes in the array
        // Your logic or response for this scenario here
      }
    }
  }

  async Payment(data:any) {
    const payment = await this.PaymentRepo.ConfirmPayment(data)
    if (payment) {
      return {
        status: 200,
        data:payment
    }
  }
  }

  async PaymentConfirm(data: any) {
    const paymentSuccess = await this.PaymentRepo.PaymentSuccess(data)
    if (!paymentSuccess) {
      console.log("faaaaaaaaaaaaaaaileeeeeeeeee");
      
      return null
    } else {
      return true
    }
  }

  async BookTutor(Data:any){
    const schedule = await this.ScheduleRepo.findById(Data.tutor);
    console.log(schedule);
    console.log(Data,"local data");
    
  
    if (schedule) {
      const datesToBook = Array.isArray(Data.timing.date) ? Data.timing.date : [Data.timing.date];
  
      let updated = false;
  
      for (const dateToBook of datesToBook) {
        const dataDateTimestamp = new Date(dateToBook).getTime();
        const indexToUpdate = schedule.timing.findIndex((time: { date: Date }) => {
          const timeDateTimestamp = new Date(time.date).getTime();
          return timeDateTimestamp === dataDateTimestamp;
        });
  console.log(indexToUpdate,"indezs");
  
        if (indexToUpdate !== -1) {
          schedule.timing[indexToUpdate].student = Data.timing.student;
          schedule.timing[indexToUpdate].fee = Data.timing.fee
          schedule.timing[indexToUpdate].status="Booked"
          updated = true; 
        }
      }
  console.log(updated,"updated");
  
      if (updated) {
        await this.ScheduleRepo.save(schedule);
        return {
          status: 200,
          data: schedule,
        };
      } else {
        return {
          status: 401,
          data: "Already Booked or Date not found",
        };
      }
    }
  }
  

  async findSchedule(id: string) {
    const schedule = await this.ScheduleRepo.findSchedule(id);
    if (schedule) {
      return {
        status: 200,
        data: schedule,
      };
    } else {
      return {
        status: 401,
        data: "Not found",
      };
    }
  }

  async BookThroughPost(data: any) {
    const schedule = await this.ScheduleRepo.findById(data.tutor);
    if (schedule) {
      schedule.timing.push({
        date: data.timing.date,
        student: data.timing.student,
        status:"Booked"
      });

      await this.ScheduleRepo.save(schedule);
      return {
        status: 200,
        data: schedule,
      };
    } else {
      return {
        status: 404,
        data: "Booking Failed",
      };
    }
    }
    
    async findStudentSchedule(id:string) {
        const schedule = await this.ScheduleRepo.findAll(id)
        console.log(schedule);
        return {
            status: 200,
            data:schedule
        }
        
  }

  async getTutorfee(tutor: string, id: string) {
    const schedule = await this.ScheduleRepo.findById(tutor)
    console.log(schedule,"schedule");
    
    const object = schedule.timing.find((item: any) => item._id == id)
    console.log(object,"object");
    
    if (object) {
      return object.fee
    } else {
      return null
    }
  }

  async cancelSchedule(data: { tutor: string, fee: string, id: string, schedule: string, timing: { date: string } }) {
    console.log("in the cancel schedule");
    
    const schedule = await this.ScheduleRepo.findById(data.tutor);
  
    if (schedule && schedule.timing && schedule.timing.length > 0) {
      const updatedTiming = schedule.timing.find((item: any) => item._id == data.schedule);
  
      if (updatedTiming) {
        updatedTiming.status = "Cancelled By Student";
        await this.ScheduleRepo.save(schedule);
        await this.studentRepo.pushNotifications(data.id, "Class Cancelled", `The class scheduled on ${data.timing.date.toString()} has been cancelled`, "Schedule")
        await this.tutorRepo.pushNotifications(data.tutor, "Class Cancelled", `The class scheduled on ${data.timing.date.toString()} has been cancelled`, "Schedule")
        return {
          status: 200,
          data: "updated",
        };
      } else {
        return {
          status: 404,
          data: "Timing not found",
        };
      }
    } else {
      return {
        status: 404,
        data: "Schedule or timing not found",
      };
    }
  }
  async cancelScheduleByTutor(data: { tutor: string, fee: string, id: string, schedule: string, timing: { date: string } }) {
    console.log("in the cancel schedule");
    
    const schedule = await this.ScheduleRepo.findById(data.tutor);
  
    if (schedule && schedule.timing && schedule.timing.length > 0) {
      const updatedTiming = schedule.timing.find((item: any) => item._id == data.schedule);
  
      if (updatedTiming) {
        updatedTiming.status = "Cancelled By Tutor";
        await this.ScheduleRepo.save(schedule);
        await this.tutorRepo.pushNotifications(data.tutor, "Class Cancelled", `The class scheduled on ${data.timing.date.toString()} has been cancelled`, "Schedule")
        await this.studentRepo.pushNotifications(data.id, "Class Cancelled", `The class scheduled on ${data.timing.date.toString()} has been cancelled`, "Schedule")
        return {
          status: 200,
          data: "updated",
        };
      } else {
        return {
          status: 404,
          data: "Timing not found",
        };
      }
    } else {
      return {
        status: 404,
        data: "Schedule or timing not found",
      };
    }
  }
  
}

export default ScheduleUsecase;
