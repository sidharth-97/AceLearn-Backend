import Admin from "../../entities/admin"

export default interface adminRepositoryInterface{
    findByEmail(email: string): Promise<any>
    findStudents(): Promise<any>
    findTutors(): Promise<any>
    blockStudentById(id: string): Promise<any>
    blockTutorById(id: string): Promise<any>
    countUsers():Promise<any>
}