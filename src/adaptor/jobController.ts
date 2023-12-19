import { Request, Response } from "express";
import JobUseCase from "../useCases/jobUsecase";
import { NextFunction } from "express-serve-static-core";
import ScheduleUsecase from "../useCases/sheduleUsecase";

class JobController {
  private jobUseCase: JobUseCase;
  private scheduleUsecase:ScheduleUsecase
  constructor(jobUseCase: JobUseCase,scheduleUsecase:ScheduleUsecase) {
    this.jobUseCase = jobUseCase;
    this.scheduleUsecase=scheduleUsecase
  }

  async addJob(req: Request, res: Response, next: NextFunction) {
    try {
      const job = await this.jobUseCase.addJob(req.body);
      res.status(job.status).json(job.data);
    } catch (error) {
      next(error);
    }
  }

  async getJobDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const job = await this.jobUseCase.getJobDetails(req.params.id);
      res.status(job.status).json(job.data);
    } catch (error) {
      next(error);
    }
  }
  async getAllJobs(req: Request, res: Response, next: NextFunction) {
    try {
      const job = await this.jobUseCase.getAllJob();
      res.status(job.status).json(job.data);
    } catch (error) {
      next(error);
    }
  }
  async applyJobs(req: Request, res: Response, next: NextFunction) {
    try {
      const job = await this.jobUseCase.applyJob(req.body);
      res.status(job.status).json(job.data);
    } catch (error) {
      next(error);
    }
  }
  async jobComplete(req: Request, res: Response, next: NextFunction) {
    try {
      let userId = (req as any)?.user.id
      req.app.locals.schedule = req.body;
      const payment = await this.scheduleUsecase.Payment(req.body);
      if (payment) {
        const job = await this.jobUseCase.jobComplete(userId)
        res.status(job.status).json(payment.data)
      }
        res.status(400).json("failed")

   
  } catch (error) {
    next(error)
  }
}

}

export default JobController;
