import { Request, Response } from "express";
import ScheduleUsecase from "../useCases/sheduleUsecase";
import StudentUseCase from "../useCases/studentUseCase";
import session from "express-session";
import Stripe from "stripe";
import TutorUseCase from "../useCases/tutorUseCase";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error("Stripe secret key is not defined");
}

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

  async scheduleTime(req: Request, res: Response) {
    const schedule = await this.scheduleUsecase.scheduleTime(req.body);
    if (schedule) {
      res.status(schedule.status).json(schedule.data);
    } else {
      res.status(401).json("Failed to add schedule");
    }
  }
  async cancelSchedulebyTutor(req: Request, res: Response) {
    console.log(req.body, "from cancel schedule");
    if (req.body.id) {
     
      const student = await this.studentUsecase.walletAmt(req.body)
    }
 
    const schedule = await this.scheduleUsecase.changeSchedule(req.body);
    if (schedule) {
      res.status(schedule.status).json(schedule.data);
    } else {
      res.status(401).json("Failed to update schedule");
    }
  }

  async cancelSchedulebyStudent(req: Request, res: Response) {
    console.log(req.body);
    
    const student = await this.studentUsecase.walletAmt(req.body)
    const schedule = await this.scheduleUsecase.changeSchedule(req.body)
    if (schedule) {
      res.status(schedule.status).json(schedule.data)
    }
  }

  //   async BookTutor(req: Request, res: Response) {
  //     console.log("book tutor");

  //     const schedule = await this.scheduleUsecase.BookTutor(req.body);
  //     if (schedule) {
  //       res.status(schedule.status).json(schedule.data);
  //     } else {
  //       res.status(401).json("Booking Failed");
  //     }
  //   }

  async TutorSchedule(req: Request, res: Response) {
    const schedule = await this.scheduleUsecase.findSchedule(req.params.id);

    if (schedule) {
      res.status(schedule.status).json(schedule.data);
    } else {
      res.status(401).json("Failed to fetch data");
    }
  }
  async bookThroughPost(req: Request, res: Response) {
    const schedule = await this.scheduleUsecase.BookThroughPost(req.body);
    res.status(schedule.status).json(schedule.data);
  }
  async findStudentSchedule(req: Request, res: Response) {
    console.log("here");

    const schedule = await this.scheduleUsecase.findStudentSchedule(
      req.params.id
    );
    res.status(schedule.status).json(schedule.data);
  }
  async payment(req: Request, res: Response) {
    req.app.locals.schedule = req.body;
    console.log("payment route");
    
    const payment = await this.scheduleUsecase.Payment(req.body);
    res.status(200).json(payment?.data);
  }

  async webhook(request: Request, response: Response) {
    console.log(request, "controller requestrr");
    const localData = request.app.locals.schedule;
    const bookTuror = await this.scheduleUsecase.BookTutor(request, localData);
    response.status(200).json(bookTuror?.data);
  }
}

export default scheduleController;
