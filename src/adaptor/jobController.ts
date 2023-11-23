import { Request, Response } from "express";
import JobUseCase from "../useCases/jobUsecase";
import { NextFunction } from "express-serve-static-core";

class JobController {
  private jobUseCase: JobUseCase;
  constructor(jobUseCase: JobUseCase) {
    this.jobUseCase = jobUseCase;
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
}

export default JobController;
