
export default interface MessageRepoInterface{
    save(data: any): Promise<any>
    findById(id: string): Promise<any>
    getLastMessages():Promise<any>
}