import Admin from "../../entities/admin"

export default interface adminRepositoryInterface{
    findByEmail(email: string): Promise<any>
}