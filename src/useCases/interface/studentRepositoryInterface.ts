import Student from "../../entities/students";

export default interface studentRepositoryInterface{
    findByEmail(email: string): Promise<any>
    save(student: Student): Promise<any>
    findAndUpdate(student: Student): Promise<any>
    findById(id:string):Promise<any>
}