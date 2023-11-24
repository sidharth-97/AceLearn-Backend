import Tutor from "../../entities/tutors"

export default interface TutorRepositoryInterface{
    findByEmail(email: string): Promise<any>
    save(tutor: Tutor): Promise<any>
    findAndUpdate(tutor: Tutor): Promise<any>
    findById(id: string): Promise<any>
    findAll(data:{page:number,
        limit: number,
        subject:string,
        minFee:number,
        maxFee: number,
        searchQuery: string,
        sortValue:string} ):Promise<any>
}