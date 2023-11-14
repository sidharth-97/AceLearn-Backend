import { Request, Response } from "express";
import StudentUseCase from "../useCases/studentUseCase";
import GenerateOTP from "../infrastructure/utils/GenerateOTP";
import SentMail from "../infrastructure/utils/sendMail";
import CloudinaryUpload from "../infrastructure/utils/CloudinaryUpload";

class studentController{
    private studentUseCase: StudentUseCase
    private genOtp: GenerateOTP
    private sentMail: SentMail
    private CloudinaryUpload:CloudinaryUpload
    constructor(studentUseCase: StudentUseCase,genOtp:GenerateOTP,sentMail:SentMail,CloudinaryUpload:CloudinaryUpload) {
        this.studentUseCase = studentUseCase,
        this.genOtp = genOtp
        this.sentMail = sentMail
        this.CloudinaryUpload=CloudinaryUpload
    }

    async signup(req: Request, res: Response) {
        try {
            const otp = await this.genOtp.generateOtp(4)
            console.log(otp,"otp");
            
            
            this.sentMail.sendMail(req.body.username, req.body.email, otp)
            
            
           

            const student = await this.studentUseCase.signup(req.body)
            
            req.app.locals.otp = otp
            
            res.status(student.status).json(student.data)
        } catch (error) {
            res.status(401).json(error)
        }
    }

    async signupStep2(req: Request, res: Response) {
        try {  
            console.log(req.body); 
            let url = ""
            if (req.file) {
                const img=await this.CloudinaryUpload.upload(req.file.path,'student-image')
                url = img.secure_url
            }
            const data = {
                email: req.body.email,
                username:req.body.username,
                password: req.body.password,
                mobile: req.body.mobile,
                image: url,
            }
            console.log(data,"data form signup form 2");
            
            if (req.body.otp!=req.app.locals.otp) {
             res.status(401).json("password doesnt match")
            }
        
            const result = await this.studentUseCase.signup2(data);
               console.log("below");
                
            res.status(result.status).json(result.data);
        } catch (error) {
            res.status(401).json(error)
        }
    }


    async login(req: Request, res: Response) {
        try {
            console.log("abcd");
            
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
    async editProfile(req: Request, res: Response) {
        try {
            const data = req.body
            if (req.file) {
                
            }
            const student = await this.studentUseCase.editProfile(req.body)
            res.status(student.status).json(student.data)
        } catch (error) {
            res.status(401).json(error)
        }
    }

    async getStudentInfo(req: Request, res: Response) {
        try {
            const studentId = req.params.id
            const result = await this.studentUseCase.getStudentData(studentId)
            if (result) {
                res.status(result.status).json(result.data)
            }
        } catch (error) {
            res.status(401).json(error)            
        }
    }

}

export default studentController