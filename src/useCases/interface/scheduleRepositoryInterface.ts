export default interface ScheduleInterface{
    findById(id:string):Promise<any>
    pushDate(date:Object):Promise<any>
}