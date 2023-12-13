export default interface liveClassRepoInterface{
    save(data: any): Promise<any>
    findById(id: string): Promise<any>
    find(): Promise<any>
    findByTutor(id: string): Promise<any>
    deleteClass(id:string):Promise<any>
}