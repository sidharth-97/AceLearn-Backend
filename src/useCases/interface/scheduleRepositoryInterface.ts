export default interface ScheduleInterface{
    findById(id:string):Promise<any>
    pushDate(date: Object): Promise<any>
    save(schedule: Object): Promise<any>
    findSchedule(id:String):Promise<any>
}