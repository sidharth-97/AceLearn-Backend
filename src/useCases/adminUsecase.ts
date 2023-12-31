import Admin from "../entities/admin";
import Encrypt from "../infrastructure/passwordRepository/hashpassword";
import jwtToken from "../infrastructure/passwordRepository/jwt";
import adminRepository from "../infrastructure/repository/adminRepository";
import studentRepository from "../infrastructure/repository/studentRepository";
import TutorRepository from "../infrastructure/repository/tutorRepository";


class adminUseCase{
    private adminRepository: adminRepository
    private encrypt: Encrypt
    private studentRepo:studentRepository
    private JWT: jwtToken
    private tutorRepo:TutorRepository
    constructor(adminRepository:adminRepository, encrypt:Encrypt,JWT:jwtToken,studentRepo:studentRepository,tutorRepo:TutorRepository) {
        this.encrypt = encrypt
        this.adminRepository = adminRepository
        this.JWT = JWT
        this.studentRepo = studentRepo
        this.tutorRepo=tutorRepo
    }

    async login(admin: Admin) {
        const isExisting = await this.adminRepository.findByEmail(admin.email)
        if (isExisting) {
            if (await this.encrypt.compare(admin.password, isExisting.password)) {
                const token =this.JWT.createJWT(isExisting.email,"admin")
                return {
                    status: 200,
                    data: isExisting,
                    token:token
                }
            } else {
                return {
                    status: 401,
                    data:"Incorrect password"
                }
            }
        } else {
            return {
                status: 401,
                data:"Incorrect email"
            }
        }
    }
    async findStudents() {
        const students = await this.adminRepository.findStudents()
        if (students) {
            return {
                status: 200,
                data:students
            }
        } else {
            return {
                status: 404,
                data:"No user found"
            }
        }
    }
    async findTutors() {
        const tutors = await this.adminRepository.findTutors()
        if (tutors) {
            return {
                status: 200,
                data:tutors
            }
        } else {
            return {
                status: 404,
                data:"No tutors found"
            }
        }
    }

    async blockStudent(id:any) {
        const student = await this.studentRepo.findById(id)
        if (student) {
            const { isBlocked, ...studentData } = student.toObject();
            const blockedStudent = { ...studentData, isBlocked: !student.isBlocked };
            await this.studentRepo.findAndUpdate(blockedStudent)
            return {
                status: 200,
                data:blockedStudent
            }
        } else {
            return {
                status: 404,
                data:"Student not found"
            }
        }
    }

    async blockTutor(id: any) {
        const tutor = await this.tutorRepo.findById(id)
        if (tutor) {
            const{isBlocked,...tutorData}=tutor.toObject()
            const blockedTutor = { ...tutorData, isBlocked:!tutor.isBlocked }
            await this.tutorRepo.findAndUpdate(blockedTutor)
            return {
                status: 200,
                data:blockedTutor
            }
        } else {
            return {
                status: 404,
                data:"Tutor not found"
            }
        }
    }

    async addSubject(data: {subject: string ,class:string}) {
        const newsubject = await this.adminRepository.findSubject()
       
            const Data = await this.adminRepository.saveSubject(newsubject,data)
            if (Data) {
                return {
                    status: 200,
                    data:Data
            }
            } else {
                return {
                    status: 401,
                    data:"Something went wrong"
                }
            
          
        }
    }
    async findSubject() {
        const subject = await this.adminRepository.findSubject()
        console.log(subject);
        
        if (subject){
            return {
                status: 200,
                data:subject
            }
        } else {
            return {
                status: 404,
                data:"Not found"
            }
            
        }
    }

    async deleteSubject(data:any) {
        const subject = await this.adminRepository.findSubject()
        const updateddata = await this.adminRepository.deleteSubject(subject,data)
        if (updateddata) {
            return {
                status: 200,
                data:"Updated successfull"
            }
        } else {
            return {
                status: 401,
                data:"Something went wrong"
            }
        }
    }
    async userCounts(){
        const count = await this.adminRepository.countUsers()
        console.log(count);
        
        if (count) {
            return {
                status: 200,
                data:count
            }
        } else {
            return {
                status: 400,
                data:"No data available"
            }
        }
    }
    async showPremiumPrice() {
        const price = await this.adminRepository.showPremium()
        if (price) {
            return {
                status: 200,
                data:price
            }
        } else {
            return {
                status: 401,
                data:"No data available"
            }
        }
    }

    async setpremiumPrice(data:any) {
        const doc=await this.adminRepository.showPremium()
        const price = await this.adminRepository.setPremium(doc, data)
        if (price) {
            return {
                status: 200,
                data:price
            }
        } else {
            return {
                status: 400,
                data:"Failed"
            }
        }
        
    }
}

export default adminUseCase