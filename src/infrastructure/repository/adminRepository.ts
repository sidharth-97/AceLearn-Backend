import adminRepositoryInterface from "../../useCases/interface/adminRepositoryInterface";
import AdminModel from "../database/adminModel";


class adminRepository implements adminRepositoryInterface{
    async findByEmail(email: string): Promise<any> {
        const admin = await AdminModel.findOne({ email: email })
        if (admin) {
            return admin
        } else {
            return null
        }
    }
}

export default adminRepository