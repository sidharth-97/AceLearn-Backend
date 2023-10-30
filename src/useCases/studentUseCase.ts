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
                status: 401,
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
        console.log("here123");
        
        const newPassword = await this.Encrypt.createHash(student.password)
        const newStudent = {
            username: student.username,
            email: student.email,
            password: newPassword,
            mobile:"464465"
        };
        await this.studentRepository.save(newStudent)
        return {
            status: 200,
            data:newStudent
        }
    }

    async login(student: Student) {
        try {
            const studentLog = await this.studentRepository.findByEmail(student.email)
            console.log(studentLog);
            if (studentLog.isBlocked) {
                return {
                    status: 403,
                    data: "Blocked by admin"
                }
            }
        if (studentLog) {
            if (await this.Encrypt.compare(student.password, studentLog.password)) {
                const token = this.JWTToken.createJWT(student.email)
                return {
                    status: 200,
                    data: studentLog,
                    token:token
                }
            } 
            else {
                return {
                    status: 403,
                    data: {
                        data:"Wrong Password"
                    }
                }
            }
        } else {
            return {
                status: 403,
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

    async editProfile(student: Student) {
        const Editstudent = await this.studentRepository.findByEmail(student.email)
        if (Editstudent) {
            Editstudent.username = student.username
            Editstudent.mobile = student.mobile
            if (student.password) {
                Editstudent.password = await this.Encrypt.createHash(student.password)
            }
        
            const updatedStudent = await Editstudent.save()
            return {
                status: 200,
                data: updatedStudent
            }
        } else {
            return {
                status: 404,
                data:"Student not found"
            }
        }
    }

    async getStudentData(id: string) {
        const student = await this.studentRepository.findById(id)
        if (student) {
            return {
                status: 200,
                data:student
            }
        } else {
            return {
                status: 404,
                data:student
            }
        }
    }

}

export default StudentUseCase