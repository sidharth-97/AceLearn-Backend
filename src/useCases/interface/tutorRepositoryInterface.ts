import Tutor from "../../entities/tutors"

export default interface TutorRepositoryInterface{
    findByEmail(email: string): Promise<any>
    save(tutor: Tutor): Promise<any>
    findAndUpdate(tutor: Tutor): Promise<any>
    findById(id:string):Promise<any>
}