
import JobRepository from "../infrastructure/repository/jobRepository";

class JobUseCase{
    private jobrepository: JobRepository
    constructor(jobrepository: JobRepository) {
        this.jobrepository=jobrepository
    }

    async addJob(data:any) {
        const job = await this.jobrepository.findByStdId(data.student)
        if (job) {
            return {
                status: 400,
                data:"You can post one job only"
            }
        } else {
            await this.jobrepository.save(data)
            return {
                status: 200,
                data:"Job added successfully"
            }
        }
    }

    async getJobDetails(id: string) {
        const job = await this.jobrepository.findByStdId(id)
        if (job) {
            return {
                status: 200,
                data:job
            }
        } else {
            return {
                status: 404,
                data:"Not found"
            }
        }
    }

}

export default JobUseCase