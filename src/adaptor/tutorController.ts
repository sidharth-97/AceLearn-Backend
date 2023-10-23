import { Request, Response } from "express"
import TutorUseCase from "../useCases/tutorUseCase"



class TutorController{
    private useCase:TutorUseCase
    constructor(useCase: TutorUseCase) {
        this.useCase=useCase
    }
    async signup(req: Request, res: Response) {
       try {
        const tutor = await this.useCase.signup(req.body)
        if (tutor) {
           res.status(tutor.status).json(tutor.data)
       } 
       } catch (error) {
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
}

export default TutorController