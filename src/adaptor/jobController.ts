import { Request, Response } from "express";
import JobUseCase from "../useCases/jobUsecase";

class JobController{
    private jobUseCase: JobUseCase
    constructor(jobUseCase: JobUseCase) {
        this.jobUseCase=jobUseCase
    }

    async addJob(req: Request, res: Response) {
        const job = await this.jobUseCase.addJob(req.body)
        res.status(job.status).json(job.data)
    }

    async getJobDetails(req: Request, res: Response) {
        const job = await this.jobUseCase.getJobDetails(req.params.id)
        res.status(job.status).json(job.data)
    }
    async getAllJobs(req: Request, res: Response) {
        const job = await this.jobUseCase.getAllJob()
        res.status(job.status).json(job.data)
    }
    async applyJobs(req: Request, res: Response) {
        const job = await this.jobUseCase.applyJob(req.body)
        res.status(job.status).json(job.data)
    }
}

export default JobController