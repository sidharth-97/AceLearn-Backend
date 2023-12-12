export default interface liveClassRepoInterface{
    save(data: any): Promise<any>
    findById(id: string): Promise<any>
    find():Promise<any>
}