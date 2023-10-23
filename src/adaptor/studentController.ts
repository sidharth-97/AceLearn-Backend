import { Request, Response } from "express";
import StudentUseCase from "../useCases/studentUseCase";

class studentController{
    private studentUseCase: StudentUseCase
    constructor(studentUseCase: StudentUseCase) {
        this.studentUseCase=studentUseCase
    }
    async signup(req: Request, res: Response) {
        try {
            const student = await this.studentUseCase.signup(req.body)
            
            res.status(student.status).json(student.data)
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