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
                const token= this.jwt.createJWT(tutorValid.email,"tutor")
                return {
                    status: 200,
                    data: tutorValid,
                    token:token
                }
            } else {
                return {
                    status: 401,
                    data:"Password not match"
                }
            }
        } else {
            return {
                status: 401,
                data:"Wrong email"
            }
        }
    }

    async editprofile(tutor:any) {
        console.log(tutor,"tutuor use case");
        
        const EditTutor = await this.repository.findByEmail(tutor.email)
        if (EditTutor) {
            EditTutor.name = tutor.name
            EditTutor.mobile = tutor.mobile
            EditTutor.bio= tutor.bio
            EditTutor.fee = tutor.fee
            EditTutor.subject = tutor.subject
            EditTutor.image = tutor.image
            
            if (tutor.password) {
                console.log(EditTutor.password,tutor.oldPassword)
                
                let compare = await this.encrypt.compare(tutor.oldPassword,EditTutor.password)
                if (compare) {
                    EditTutor.password=await this.encrypt.createHash(tutor.password)
                } else {
                    return {
                        status: 401,
                        data:"Old password wrong"
                    }
                }
                
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
    async addReview(data: any) {
        console.log(data,"this is form usecase");
        
        const tutor= await this.repository.findById(data.id)
        if (tutor) {
            await this.repository.addReview(tutor, data)
            return {
                status: 200,
                data:"Review Added"
            }
        }
        return {
            status: 200,
            data: "Review Not Added"
        }

    }
    
    async getTutorReview(id:string) {
        const tutor = await this.repository.findById(id)
        if (tutor) {
            return {
                status: 200,
                data:tutor.review
            }
        } else {
            return {
                status: 404,
                data:"Not found"
            }
        }
    }

    async oldReview(data: { tutor: string, student: string }) {
        const decoded = this.jwt.verifyJWT(data.student)
        console.log(decoded,"this is the decoded data");
        
        const tutor = await this.repository.findById(data.tutor)
        if (tutor) {
            const oldReview = await this.repository.oldReview(tutor, decoded.id)
            if (oldReview) {
                return {
                    status: 200,
                    data:oldReview
                }
            } else {
                return {
                    status: 200,
                    data:"Not found"
                }
                
            }
        } else {
            return {
                status: 404,
                data:"Tutor not found"
            }
        }
    }

    async PayTutor(tutor: string,fee:number) {
        const tutordata = await this.repository.findById(tutor)
        const updateWallet = await this.repository.payTutor(tutordata, fee)
        if (updateWallet) {
            return {
                status: 200,
                data:"Payment added to Wallet"
            }
        } else {
            return {
                status: 401,
                data:"Payment failed"
            }
        }
    }

    async showNotifications(id: string) {
        const tutor = await this.repository.findById(id)
        if (tutor.notifications) {
            return {
                status: 200,
                data:tutor.notifications
            }
        } else {
            return {
                status: 401,
                data:"No new notifications"
            }
        }
    }

}

export default TutorUseCase