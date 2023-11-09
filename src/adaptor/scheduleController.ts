import { Request, Response } from "express";
import ScheduleUsecase from "../useCases/sheduleUsecase";
import session from "express-session";
import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error("Stripe secret key is not defined");
}

interface MySession {
  schedule?: any; // Define the structure of the 'schedule' property
}
class scheduleController {
  private scheduleUsecase: ScheduleUsecase;
  constructor(scheduleUsecase: ScheduleUsecase) {
    this.scheduleUsecase = scheduleUsecase;
  }

  async scheduleTime(req: Request, res: Response) {
    const schedule = await this.scheduleUsecase.scheduleTime(req.body);
    if (schedule) {
      res.status(schedule.status).json(schedule.data);
    } else {
      res.status(401).json("Failed to add schedule");
    }
  }
  async changeSchedule(req: Request, res: Response) {
    console.log(req.body);

    const schedule = await this.scheduleUsecase.changeSchedule(req.body);
    if (schedule) {
      res.status(schedule.status).json(schedule.data);
    } else {
      res.status(401).json("Failed to update schedule");
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
    console.log(schedule, "here");

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
