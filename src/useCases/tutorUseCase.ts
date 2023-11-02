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
            return {
                status: 200,
                data:isExisting
            }
        }
    }

    async signup2(tutor: Tutor) {
        console.log("546"+tutor.password);
        
        const newPassword = await this.encrypt.createHash(tutor.password)
        console.log(newPassword,"newpass");
        
        const newTutor = { ...tutor, password: newPassword }
        console.log(newTutor,"newtutot");
        
        await this.repository.save(newTutor)
        return {
            status: 200,
            data:newTutor
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

    async editprofile(tutor: Tutor) {
        const EditTutor = await this.repository.findByEmail(tutor.email)
        if (EditTutor) {
            EditTutor.name = tutor.name
            EditTutor.mobileNo = tutor.mobileNo
            EditTutor.bio= tutor.bio
            EditTutor.fee = tutor.fee
            EditTutor.subject = tutor.subject
            EditTutor.image = tutor.image
            
            if (tutor.password) {
                EditTutor.password=await this.encrypt.createHash(tutor.password)
            }
            const updatedTutor = await this.repository.save( EditTutor)
            return {
                status: 200,
                data:updatedTutor
            }
        } else {
            return {
                status: 404,
                data:"Tutor not found"
            }
        }
    }

    async getTutorData(id: string) {
        const tutor = await this.repository.findById(id)
        if (tutor) {
            return {
                status: 200,
                data:tutor
            }
        } else {
            return {
                status: 404,
                data:"Tutor not found"
            }
        }
    }
    async getAllTutor() {
        const Tutor = await this.repository.findAll()
        if (Tutor) {
            return {
                status: 200,
                data:Tutor
            }
        } else {
            return {
                status: 404,
                data:"No Tutors found"
            }
        }
    }

}

export default TutorUseCase