import { Schedule } from "../infrastructure/database/ScheduleModel";
import ScheduleRepository from "../infrastructure/repository/scheduleRepository";

interface schedule{
    tutor: string,
    timing: {
        date: Date,
        student:string
    }
}

class ScheduleUsecase{
    private ScheduleRepo:ScheduleRepository
    constructor(ScheduleRepo: ScheduleRepository) {
        this.ScheduleRepo=ScheduleRepo
    }

    async scheduleTime(data: schedule) {

        const schedule = await this.ScheduleRepo.pushDate(data)
        console.log(schedule,"reached usecase");
        
        if (schedule) {
            return {
            status: 200,
            data:schedule
        }
        } else {
            return {
                status: 404,
                data:"Failed to add"
            }
        }
        
    }

}

export default ScheduleUsecase