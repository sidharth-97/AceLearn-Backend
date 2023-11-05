export default interface jobRepositoryInterface{
    findByStdId(id: string): Promise<any>
    save(job:Object):Promise<any>
}