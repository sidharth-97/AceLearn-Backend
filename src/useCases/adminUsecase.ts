import Admin from "../entities/admin";
import Encrypt from "../infrastructure/passwordRepository/hashpassword";
import jwtToken from "../infrastructure/passwordRepository/jwt";
import adminRepository from "../infrastructure/repository/adminRepository";

class adminUseCase{
    private repository:adminRepository
    private encrypt: Encrypt
    private JWT:jwtToken
    constructor(repository:adminRepository, encrypt:Encrypt,JWT:jwtToken) {
        this.encrypt = encrypt
        this.repository = repository
        this.JWT=JWT
    }

    async login(admin: Admin) {
        const isExisting = await this.repository.findByEmail(admin.email)
        if (isExisting) {
            if (await this.encrypt.compare(admin.password, isExisting.password)) {
                const token =this.JWT.createJWT(isExisting.email)
                return {
                    status: 200,
                    data: isExisting,
                    token:token
                }
            } else {
                return {
                    status: 200,
                    data:"Incorrect password"
                }
            }
        } else {
            return {
                status: 200,
                data:"Incorrect email"
            }
        }
    }
}

export default adminUseCase