import Tutor from "../entities/tutors";
import Encrypt from "../infrastructure/passwordRepository/hashpassword";
import TutorRepository from "../infrastructure/repository/tutorRepository";
import JWT from "./interface/jwtInterface";

class TutorUseCase{
    private repository: TutorRepository
    private jwt: JWT
    private encrypt:Encrypt
    constructor(repository: TutorRepository, jwt: JWT,encrypt:Encrypt) {
        this.jwt = jwt
        this.repository = repository
        this.encrypt=encrypt
    }
    async signup(tutor: Tutor) {
        console.log("here");
        
        const isExisting = await this.repository.findByEmail(tutor.email)
        if (isExisting) {
            return {
                status: 200,
                data:"Tutor already exists"
            }

        } else {
            const newPassword = await this.encrypt.createHash(tutor.password)
            const newTutor = { ...tutor, password: newPassword }
            await this.repository.save(newTutor)
            return {
                status: 200,
                data:newTutor
            }
        }
    }

    async login(tutor: Tutor) {
        const tutorValid = await this.repository.findByEmail(tutor.email)
        if (tutorValid) {
            if (await this.encrypt.compare(tutor.password, tutorValid.password)) {
                const token= this.jwt.createJWT(tutorValid.email)
                return {
                    status: 200,
                    data: tutorValid,
                    token:token
                }
            } else {
                return {
                    status: 200,
                    data:"Password not match"
                }
            }
        } else {
            return {
                status: 200,
                data:"Wrong email"
            }
        }
    }

}

export default TutorUseCase