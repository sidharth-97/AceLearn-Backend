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

    async changeSchedule(data:{
        tutor: string,
        timing: {
            date: Date,
            newDate:Date
        }
    }) {
        
        const schedule = await this.ScheduleRepo.findById(data.tutor)
        console.log(schedule,"schedule");
        
        if (schedule) {
            
            const indexToUpdate = schedule.timing.findIndex((time:{date:Date,newDate:Date}) => {
                const timeDateTimestamp = new Date(time.date).getTime();
                const dataDateTimestamp = new Date(data.timing.date).getTime();
                return timeDateTimestamp === dataDateTimestamp;
            });

            if (indexToUpdate !== -1) {
                schedule.timing[indexToUpdate].date = new Date(data.timing.newDate);

                await this.ScheduleRepo.save(schedule)
                return {
                    status: 200,
                    data:schedule
                }
            } else {
                // Date doesn't exist, add a new entry to the schedule
                // Your existing code for adding a new schedule here
            }

        
        }
    } 

    async BookTutor(data:schedule){
        const schedule = await this.ScheduleRepo.findById(data.tutor)  
        
        if (schedule) {
            const indexToUpdate = schedule.timing.findIndex((time:{date:Date,newDate:Date}) => {
                const timeDateTimestamp = new Date(time.date).getTime();
                const dataDateTimestamp = new Date(data.timing.date).getTime();
                return timeDateTimestamp === dataDateTimestamp;
            });
console.log(indexToUpdate,"this is the index to update");

            if (indexToUpdate !== -1) {
                if (!schedule.timing[indexToUpdate].student) {
               
                       schedule.timing[indexToUpdate].student = data.timing.student;
    
                    await this.ScheduleRepo.save(schedule)
                  
                } else {
                  console.log("booked");
                    return {
                        status: 401,
                        data:"Already Booked"
                    }
                 
                }
                return {
                    status: 200,
                    data:schedule
                }
            } else {
              
            }
        }
    }

    async findSchedule(id:string){
        const schedule = await this.ScheduleRepo.findSchedule(id)
        if (schedule) {
            return {
                status: 200,
                data:schedule
            }
        } else {
            return {
                status: 401,
                data:"Not found"
            }
        }
    }

    async BookThroughPost(data: any) {
        const schedule = await this.ScheduleRepo.findById(data.tutor)
        if (schedule) {
            schedule.timing.push({
                date: data.timing.date,
                student:data.timing.student
            })

            await this.ScheduleRepo.save(schedule)
            return {
                status: 200,
                data:schedule
            }
        } else {
            return {
                status: 404,
                data:"Booking Failed"
            }
        }

    }
}

export default ScheduleUsecase