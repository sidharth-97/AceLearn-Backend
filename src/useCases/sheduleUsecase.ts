import PaymentRepository from "../infrastructure/repository/paymentRepository";
import ScheduleRepository from "../infrastructure/repository/scheduleRepository";

interface schedule {
  tutor: string;
  timing: {
    date: Date;
    student: string;
  };
}

class ScheduleUsecase {
  private ScheduleRepo: ScheduleRepository;
  private PaymentRepo:PaymentRepository
  constructor(ScheduleRepo: ScheduleRepository, PaymentRepo:PaymentRepository) {
    this.ScheduleRepo = ScheduleRepo;
    this.PaymentRepo=PaymentRepo
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

  async BookTutor(data:any,localData:any) {
    const paymentSuccess = await this.PaymentRepo.PaymentSuccess(data)
    if (!paymentSuccess) {
      console.log("faaaaaaaaaaaaaaaileeeeeeeeee");
      
      return {
        status: 401,
        data: "Payment failed"
      }
    } else {
      console.log(paymentSuccess, "this is the resutl of redix");
    }
    console.log("boooking succedddddddddddddd");
    
    const schedule = await this.ScheduleRepo.findById(localData.tutor);
  
    if (schedule) {
      const datesToBook = Array.isArray(localData.timing.date) ? localData.timing.date : [localData.timing.date];
  
      let updated = false;
  
      for (const dateToBook of datesToBook) {
        const dataDateTimestamp = new Date(dateToBook).getTime();
        const indexToUpdate = schedule.timing.findIndex((time: { date: Date }) => {
          const timeDateTimestamp = new Date(time.date).getTime();
          return timeDateTimestamp === dataDateTimestamp;
        });
  
        if (indexToUpdate !== -1) {
          schedule.timing[indexToUpdate].student = localData.timing.student;
          updated = true;
        }
      }
  
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
}

export default ScheduleUsecase;
