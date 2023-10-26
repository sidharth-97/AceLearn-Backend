import { Request, Response } from "express";
import StudentUseCase from "../useCases/studentUseCase";
import GenerateOTP from "../infrastructure/utils/GenerateOTP";
import SentMail from "../infrastructure/utils/sendMail";

class studentController{
    private studentUseCase: StudentUseCase
    private genOtp: GenerateOTP
    private sentMail:SentMail
    constructor(studentUseCase: StudentUseCase,genOtp:GenerateOTP,sentMail:SentMail) {
        this.studentUseCase = studentUseCase,
            this.genOtp = genOtp
        this.sentMail=sentMail
    }



    async signup(req: Request, res: Response) {
        try {
            const otp =await this.genOtp.generateOtp(5)
            
             this.sentMail.sendMail(req.body.username,req.body.email,otp)

            const student = await this.studentUseCase.signup(req.body)
            // localStorage.setItem('studentData', JSON.stringify(req.body));
            
            res.status(student.status).json(student.data)
        } catch (error) {
            res.status(401).json(error)
        }
    }

    async signupStep2(req: Request, res: Response) {
        try {
            const studentData = localStorage.getItem('studentData');
            if (!studentData) {
              throw new Error('Student data not found in local storage');
            }
        
            const student = JSON.parse(studentData);
        
            const result = await this.studentUseCase.signup2(student);
        
            // localStorage.removeItem('studentData');
        
            res.status(result.status).json(result.data);
        } catch (error) {
            res.status(401).json(error)
        }
    }


    async login(req: Request, res: Response) {
        try {
            const student = await this.studentUseCase.login(req.body)
            if (student) {
                res.cookie('Studentjwt', student.token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV !== 'development',
                    sameSite: 'strict',
                    maxAge: 30 * 24 * 60 * 60 * 1000,
                  });
          

                res.status(student?.status).json(student.data)
            }
        } catch (error) {
            res.status(401).json(error)
        }
    }
    async logout(req: Request, res: Response) {
        try {
            res.cookie('Studentjwt', "", {
                httpOnly: true,
                expires:new Date(0)
            })
            res.status(200).json("Student Logged Out")
        } catch (error) {
            res.status(401).json(error)
        }
    }

}

export default studentController