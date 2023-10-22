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
            res.status(tutor.status).json(tutor.data)
        } catch (error) {
            res.status(401).json(error)
        }
    }
}

export default TutorController