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

}

export default scheduleController