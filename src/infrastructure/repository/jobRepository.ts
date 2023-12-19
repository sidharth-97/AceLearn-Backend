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
        
         let job = await JobModel.findOne({ student: id }).populate("requests.tutor")
         console.log(job,"here it is ");
         
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
    async findAll(): Promise<any> {
        try {
            const job = await JobModel.find()
            if (job) {
                return job
            } else {
                return null
            }
        } catch (error) {
            console.log(error);
            
        }
    }
    async deleteById(jobId: string): Promise<any> {
        try {
            const result = await JobModel.deleteOne({ _id: jobId });
            if (result.deletedCount === 1) {
                return { success: true };
            } else {
                return { success: false, message: 'Document not found' };
            }
        } catch (error) {
            console.error(error);
            return { success: false, message: 'Error deleting document' };
        }
    }
    
}


export default JobRepository