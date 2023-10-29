import { Request, Response } from "express"
import TutorUseCase from "../useCases/tutorUseCase"
import GenerateOTP from "../infrastructure/utils/GenerateOTP"
import SentMail from "../infrastructure/utils/sendMail"



class TutorController{
    private useCase: TutorUseCase
    private genOtp: GenerateOTP
    private sentMail:SentMail
    constructor(useCase: TutorUseCase,genOtp: GenerateOTP,sentMail:SentMail) {
        this.useCase = useCase
        this.genOtp = genOtp
        this.sentMail=sentMail
    }
    async signup(req: Request, res: Response) {
        try {
            const otp =await this.genOtp.generateOtp(4)
            this.sentMail.sendMail(req.body.username,req.body.email,otp)
            const tutor = await this.useCase.signup(req.body)
            req.app.locals.Tutordata = req.body
            req.app.locals.otp = otp
            console.log(tutor);
        if (tutor) {
           res.status(tutor.status).json(tutor.data)
       } 
       } catch (error) {
        res.status(401).json(error)
       }
    }

    async signupStep2(req: Request, res: Response) {
        try {
            console.log("hreee");
            
            if (req.body.otp != req.app.locals.otp) {
                res.status(401).json("otp doesnt match")
            } else {
                const { subject,rate,bio } = req.body             
                const tutor = { ...req.app.locals.Tutordata, subject,rate,bio }
                const result = await this.useCase.signup2(tutor)
                res.status(result.status).json(result.data)
            }
        } catch (error) {
            console.log("errro");
            
            res.status(401).json(error)
        }
    }



    async login(req: Request, res: Response) {
        try {
            const tutor = await this.useCase.login(req.body)
            res.cookie('Tutorjwt', tutor.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== 'development',
                sameSite: 'strict',
                maxAge: 30 * 24 * 60 * 60 * 1000,
              });
            res.status(tutor.status).json(tutor.data)
        } catch (error) {
            res.status(401).json(error)
        }
    }
    async logout(req: Request, res: Response) {
        try {
            res.cookie('Tutorjwt', "", {
                httpOnly: true,
                expires:new Date(0)
            })
            res.status(200).json("Tutor Logged Out")
        } catch (error) {
            res.status(401).json(error)
        }
    }

    async editProfile(req: Request, res: Response) {
        try {
            const tutor = await this.useCase.editprofile(req.body)
            res.status(tutor.status).json(tutor.data)
        } catch (error) {
            res.status(401).json(error)            
        }
    }

    async getTutorInfo(req: Request, res: Response) {
        try {
            const tutorId = req.params.id
            const result = await this.useCase.getTutorData(tutorId)
            if (result) {
                res.status(result.status).json(result.data)
            }
            
        } catch (error) {
            res.status(401).json(error)            
        }
    }
}

export default TutorController