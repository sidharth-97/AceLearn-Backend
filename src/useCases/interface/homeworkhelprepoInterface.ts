import { Questions } from "../../infrastructure/database/Questions"

export default interface homeworkHelpRepoInterface{
    findById(id: string): Promise<any>
    save(data: Questions): Promise<any>
    findByStudent(id: string): Promise<any>
    findAll(subjects: string[]):Promise<any>
}