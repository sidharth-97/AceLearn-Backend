import Student from "../entities/students";
import Encrypt from "../infrastructure/passwordRepository/hashpassword";
import jwtToken from "../infrastructure/passwordRepository/jwt";
import studentRepository from "../infrastructure/repository/studentRepository";

class StudentUseCase{
    private Encrypt: Encrypt;
    private studentRepository: studentRepository;
    private JWTToken:jwtToken
    constructor(Encrypt: Encrypt, studentRepository: studentRepository,
        JWTToken:jwtToken) {
        this.Encrypt = Encrypt,
            this.studentRepository = studentRepository,
            this.JWTToken=JWTToken
    }

    async signup(student: Student) {
  console.log("here");
  
        const isExisting = await this.studentRepository.findByEmail(student.email)
        if (isExisting) {
            return {
                status: 200,
                data:"Student already exists"
            }
        } else {
        //     const newPassword = await this.Encrypt.createHash(student.password)
        //     const newStudent = { ...student, password: newPassword }
        //     await this.studentRepository.save(newStudent)
            return {
                status: 200,
                data:isExisting
            }
        }
        
    }

    async signup2(student: Student) {
        const newPassword = await this.Encrypt.createHash(student.password)
        const newStudent = { ...student, password: newPassword }
        await this.studentRepository.save(newStudent)
        return {
            status: 200,
            data:newStudent
        }
    }

    async login(student: Student) {
        try {
            const studentLog = await this.studentRepository.findByEmail(student.email)
        if (studentLog) {
            if (await this.Encrypt.compare(student.password, studentLog.password)) {
                const token = this.JWTToken.createJWT(student.email)
                return {
                    status: 200,
                    data: studentLog,
                    token:token
                }
            } else {
                return {
                    status: 200,
                    data: {
                        data:"Wrong Password"
                    }
                }
            }
        } else {
            return {
                status: 200,
                data:"Email Wrong"
            }
        }
        } catch (error) {
            return {
                status: 404,
                data:error
            }
        }
    }

}

export default StudentUseCase