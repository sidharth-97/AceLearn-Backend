import { Request, Response } from "express"
import ScheduleUsecase from "../useCases/sheduleUsecase"

class scheduleController{
    private scheduleUsecase: ScheduleUsecase
    constructor(scheduleUsecase: ScheduleUsecase) {
        this.scheduleUsecase=scheduleUsecase
    }

    async scheduleTime(req: Request, res: Response) {
        const schedule = await this.scheduleUsecase.scheduleTime(req.body)
        if (schedule) {
            res.status(schedule.status).json(schedule.data)
        } else {
            res.status(401).json("Failed to add schedule")
        }
    }
    async changeSchedule(req: Request, res: Response) {
        console.log(req.body);
        
        const schedule=await this.scheduleUsecase.changeSchedule(req.body)
        if (schedule) {
            res.status(schedule.status).json(schedule.data)
        } else {
            res.status(401).json("Failed to update schedule")
        }
    }
    
    async BookTutor(req: Request, res: Response) {
        console.log("book tutor");
        
        const schedule = await this.scheduleUsecase.BookTutor(req.body)
        if (schedule) {
            res.status(schedule.status).json(schedule.data)
        } else {
            res.status(401).json("Booking Failed")
        }
    }

    async TutorSchedule(req: Request, res: Response) {
        const schedule = await this.scheduleUsecase.findSchedule(req.params.id)
        console.log(schedule,"here");
        
        if (schedule) {
            res.status(schedule.status).json(schedule.data)
        } else {
            res.status(401).json("Failed to fetch data")
        }
    }
    async bookThroughPost(req: Request, res: Response) {
        const schedule = await this.scheduleUsecase.BookThroughPost(req.body)
        res.status(schedule.status).json(schedule.data)
    }
    async findStudentSchedule(req: Request, res: Response) {
        console.log("here");
        
        const schedule = await this.scheduleUsecase.findStudentSchedule(req.params.id)
        res.status(schedule.status).json(schedule.data)
    }

}

export default scheduleController