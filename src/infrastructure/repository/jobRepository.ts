import e from "express"
import jobRepositoryInterface from "../../useCases/interface/jobRepositoryInterface"
import { JobModel } from "../database/jobModel"


interface Job{
    student: string
    subject: string
    timeRange: string
    class:string
    requests: {
        tutor: string
        fee: string
        date:Date
    }
}

class JobRepository implements jobRepositoryInterface{
     async findByStdId(id: string): Promise<any> {
        
         let job = await JobModel.findOne({ student: id })
         if (job) {
             return job
         } else {
             return null
         }
    }
     async save(job: Object): Promise<any> {
        try {
            const newJob = new JobModel(job)
            await newJob.save()
        } catch (error) {
            console.log(error);
            
        }
    }
}


export default JobRepository