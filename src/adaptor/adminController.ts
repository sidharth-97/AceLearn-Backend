import { Request, Response } from "express";
import adminUseCase from "../useCases/adminUsecase";


class adminController{
    private use_case: adminUseCase
    constructor(use_case: adminUseCase) {
        this.use_case=use_case
    }
    async login(req: Request, res: Response) {
        try {
            const admin = await this.use_case.login(req.body)
            res.cookie('Adminjwt', admin.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== 'development',
                sameSite: 'strict',
                maxAge: 30 * 24 * 60 * 60 * 1000,
              });
            res.status(admin.status).json(admin.data)
        } catch (error) {
            res.status(401).json(error)
        }
    }
    async logout(req: Request, res: Response) {
        try {
            res.cookie('Adminjwt', "", {
                httpOnly: true,
                expires:new Date(0)
            })
            res.status(200).json("Admin Logged Out")
        } catch (error) {
            res.status(401).json(error)
        }
    }
    
    async findStudents(req: Request, res: Response) {
        try {
            const students = await this.use_case.findStudents()
            res.status(students.status).json(students.data)
        } catch (error) {
            res.status(401).json(error)
        }
    }
    
    async findTutors(req: Request, res: Response) {
        try {
            const tutors = await this.use_case.findTutors()
            res.status(tutors.status).json(tutors.data)
        } catch (error) {
            res.status(401).json(error)
        }
    }

    async blockStudent(req: Request, res: Response) {
        try {
            console.log(req,"reached");
            
            const student = await this.use_case.blockStudent(req?.params.id)
            res.status(student.status).json(student.data)
        } catch (error) {
            res.status(401).json(error)
        }
    }
    async blockTutor(req: Request, res: Response) {
        try {
            const tutor = await this.use_case.blockTutor(req?.params.id)
            res.status(tutor.status).json(tutor.data)
        } catch (error) {
            res.status(401).json(error)
        }
    }
    async addAcademicInfo(req: Request, res: Response) {
        try {
            console.log(req.body);

            const subject = await this.use_case.addSubject(req.body)
            res.status(subject.status).json(subject.data)
        } catch (error) {
            res.status(401).json(error)
        }
    }
    async AcademicInfo(req: Request, res: Response) {
        try {
            const subject = await this.use_case.findSubject()
            res.status(subject.status).json(subject.data)
        } catch (error) {
            res.status(401).json(error)
        }
    }
    async modifyAcademicInfo(req: Request, res: Response) {
        try {
            console.log(req.body,"admin controller");
            
            const updated = await this.use_case.deleteSubject(req.body)
            res.status(updated.status).json(updated.data)
        } catch (error) {
            res.status(401).json(error)
        }
    }

}

export default adminController