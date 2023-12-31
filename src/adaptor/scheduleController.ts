import { NextFunction, Request, Response } from "express";
import ScheduleUsecase from "../useCases/sheduleUsecase";
import StudentUseCase from "../useCases/studentUseCase";
import session from "express-session";
import Stripe from "stripe";
import TutorUseCase from "../useCases/tutorUseCase";
import { sendNotification } from "../infrastructure/utils/sendNotifications";
import * as schedule from 'node-schedule';



const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error("Stripe secret key is not defined");
}

export const jobMap = new Map<string, schedule.Job>();

interface MySession {
  schedule?: any; // Define the structure of the 'schedule' property
}
class scheduleController {
  private scheduleUsecase: ScheduleUsecase;
  private studentUsecase: StudentUseCase
  private tutorUsecase:TutorUseCase
  constructor(scheduleUsecase: ScheduleUsecase,studentUsecase:StudentUseCase,tutorUsecase:TutorUseCase) {
    this.scheduleUsecase = scheduleUsecase;
    this.studentUsecase = studentUsecase
    this.tutorUsecase=tutorUsecase
  }

  async scheduleTime(req: Request, res: Response,next:NextFunction) {
    try {
      const schedule = await this.scheduleUsecase.scheduleTime(req.body);
    if (schedule) {
      res.status(schedule.status).json(schedule.data);
    } else {
      res.status(401).json("Failed to add schedule");
    }
    } catch (error) {
      next(error)
    }
    
  }
  async cancelSchedulebyTutor(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(req.body, "from cancel schedule");
    if (req.body.id) {
     
      const student = await this.studentUsecase.walletAmt(req.body)
    }
      
    } catch (error) {
      next(error)
    }
    
 
    const schedule = await this.scheduleUsecase.cancelScheduleByTutor(req.body);
    if (schedule) {
      const jobNameToCancel = req.body.tutor+req.body.timing.date
const jobToCancel = jobMap.get(jobNameToCancel);

if (jobToCancel) {
  jobToCancel.cancel();
  console.log(`Job '${jobNameToCancel}' canceled successfully.`);
} else {
  console.warn(`Job '${jobNameToCancel}' not found.`);
}
      res.status(schedule.status).json(schedule.data);
    } else {
      res.status(401).json("Failed to update schedule");
    }
  }

  async cancelSchedulebyStudent(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(req.body);
    
      const student = await this.studentUsecase.walletAmt(req.body)
      const schedule = await this.scheduleUsecase.cancelSchedule(req.body)
      if (schedule) {
        const jobNameToCancel = req.body.tutor+req.body.timing.date
        const jobToCancel = jobMap.get(jobNameToCancel);
        
        if (jobToCancel) {
          jobToCancel.cancel();
          console.log(`Job '${jobNameToCancel}' canceled successfully.`);
        } else {
          console.warn(`Job '${jobNameToCancel}' not found.`);
        }
        res.status(schedule.status).json(schedule.data)
      }
    }
    catch (error) {
      next(error)
    }
  }

  //   async BookTutor(req: Request, res: Response,next:NextFunction) {
  //     console.log("book tutor");

  //     const schedule = await this.scheduleUsecase.BookTutor(req.body);
  //     if (schedule) {
  //       res.status(schedule.status).json(schedule.data);
  //     } else {
  //       res.status(401).json("Booking Failed");
  //     }
  //   }

  async TutorSchedule(req: Request, res: Response, next: NextFunction) {
    
    try {
        const schedule = await this.scheduleUsecase.findSchedule(req.params.id);

    if (schedule) {
      res.status(schedule.status).json(schedule.data);
    } else {
      res.status(401).json("Failed to fetch data");
    }
    } catch (error) {
      next(error)
    }
  
  }
  async bookThroughPost(req: Request, res: Response, next: NextFunction) {
    try {
      const schedule = await this.scheduleUsecase.BookThroughPost(req.body);
    res.status(schedule.status).json(schedule.data);
    } catch (error) {
      next(error)
    }
    
  }
  async findStudentSchedule(req: Request, res: Response,next:NextFunction) {
    try {
      console.log("here");

    const schedule = await this.scheduleUsecase.findStudentSchedule(
      req.params.id
    );
    res.status(schedule.status).json(schedule.data);
    } catch (error) {
      next(error)
    }
  }
  async payment(req: Request, res: Response,next:NextFunction) {
   try {
    req.app.locals.schedule = req.body;
    console.log("payment route");
    
    const payment = await this.scheduleUsecase.Payment(req.body);
    res.status(200).json(payment?.data);
   } catch (error) {
    next(error)
   }
  }

async webhook(request: Request, response: Response,next:NextFunction) {
  try {
  console.log(request);
  
  const localData = request.app.locals.schedule;
  const Payment = await this.scheduleUsecase.PaymentConfirm(request);
  if (Payment) {
    const booking = await this.scheduleUsecase.BookTutor(localData)
    const student = await this.studentUsecase.getStudentData(request.body.timing.student)
    const tutor = await this.tutorUsecase.getTutorData(request.body.tutor)
    request.body.timing.date.forEach((date:Date) => {
      const jobName = date + tutor.data._id
      const notificationDate = new Date(date.getTime() - 30 * 60 * 1000);
    const job=schedule.scheduleJob(notificationDate, () => {
        sendNotification(student.data.token,"Class will start in an hour","Reminder");
        sendNotification(tutor.data.token,"Class will start in an hour","Reminder");
      });
      jobMap.set(jobName, job);
    });
    response.status(200).json(booking?.data);
  } else {
    response.status(400).json("Booking failed")
}
} catch (error) {
  next(error)
}
  }

  async bookWithWallet(request: Request, response: Response, next: NextFunction) {
    try {
      console.log(request.body,"book with wallet");
      
    let data={id: request.body.timing.student, fee:-(request.body.fees) }
      const payment = await this.studentUsecase.walletAmt(data)
      if (payment) {
        const student = await this.studentUsecase.getStudentData(request.body.timing.student)
        const tutor=await this.tutorUsecase.getTutorData(request.body.tutor)
        const booking = await this.scheduleUsecase.BookTutor(request.body)
        request.body.timing.date.forEach((date:Date) => {
          const jobName = date + tutor.data._id
          const notificationDate = new Date(date.getTime() - 30 * 60 * 1000);
        const job=schedule.scheduleJob(notificationDate, () => {
            sendNotification(student.data.token,"Class will start in an hour","Reminder");
            sendNotification(tutor.data.token,"Class will start in an hour","Reminder");
          });
          jobMap.set(jobName, job);
        });
        response.status(200).json(booking?.data)
      } else {
        response.status(400).json("Not enough wallet balance")
      }
  } catch (error) {
    next(error)
  }
  }
  
  async studentTimeline(req: Request, res: Response, next: NextFunction) {
    console.log("reached tiemlineeee");
    
    try {
      let userId = (req as any)?.user.id
      const timeline = await this.scheduleUsecase.studentTimeline(userId)
      res.status(timeline.status).json(timeline.data)
    } catch (error) {
      next(error)
    }
  }

  async tutorAvailable(req: Request, res: Response, next: NextFunction) {
    try {
      const tutorAvailable = await this.scheduleUsecase.tutorAvailable(req.params.id)
      res.status(tutorAvailable.status).json(tutorAvailable.data)
    } catch (error) {
      next(error)
    }
  }

}

export default scheduleController;
