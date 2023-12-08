import { NextFunction, Request, Response } from "express";
import adminUseCase from "../useCases/adminUsecase";


class adminController{
    private use_case: adminUseCase
    constructor(use_case: adminUseCase) {
        this.use_case=use_case
    }
    async login(req: Request, res: Response,next:NextFunction) {
        try {
            const admin = await this.use_case.login(req.body)
            res.cookie('Adminjwt', admin.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== 'development',
                sameSite: 'none',
                maxAge: 30 * 24 * 60 * 60 * 1000,
              });
            res.status(admin.status).json(admin.data)
        } catch (error) {
            next(error)
        }
    }
    async logout(req: Request, res: Response,next:NextFunction) {
        try {
            res.cookie('Adminjwt', "", {
                httpOnly: true,
                expires:new Date(0)
            })
            res.status(200).json("Admin Logged Out")
        } catch (error) {
            next(error)
        }
    }
    
    async findStudents(req: Request, res: Response,next:NextFunction) {
        try {
            const students = await this.use_case.findStudents()
            res.status(students.status).json(students.data)
        } catch (error) {
            next(error)
        }
    }
    
    async findTutors(req: Request, res: Response,next:NextFunction) {
        try {
            const tutors = await this.use_case.findTutors()
            res.status(tutors.status).json(tutors.data)
        } catch (error) {
            next(error)
        }
    }

    async blockStudent(req: Request, res: Response,next:NextFunction) {
        try {
            console.log(req,"reached");
            
            const student = await this.use_case.blockStudent(req?.params.id)
            res.status(student.status).json(student.data)
        } catch (error) {
            next(error)
        }
    }
    async blockTutor(req: Request, res: Response,next:NextFunction) {
        try {
            const tutor = await this.use_case.blockTutor(req?.params.id)
            res.status(tutor.status).json(tutor.data)
        } catch (error) {
            next(error)
        }
    }
    async addAcademicInfo(req: Request, res: Response,next:NextFunction) {
        try {
            console.log(req.body);

            const subject = await this.use_case.addSubject(req.body)
            res.status(subject.status).json(subject.data)
        } catch (error) {
            next(error)
        }
    }
    async AcademicInfo(req: Request, res: Response,next:NextFunction) {
        try {
            const subject = await this.use_case.findSubject()
            res.status(subject.status).json(subject.data)
        } catch (error) {
            next(error)
        }
    }
    async modifyAcademicInfo(req: Request, res: Response,next:NextFunction) {
        try {
            console.log(req.body,"admin controller");
            
            const updated = await this.use_case.deleteSubject(req.body)
            res.status(updated.status).json(updated.data)
        } catch (error) {
            next(error)
        }
    }

    async userCount(req: Request, res: Response, next: NextFunction) {
        try {
            console.log("racheced");
            
            const counts = await this.use_case.userCounts()
            res.status(counts.status).json(counts.data)
        } catch (error) {
            next(error)
        }
    }

    
    async showPremiumPrice(req: Request, res: Response, next: NextFunction) {
        try {
            console.log("show premium price");
            
            const price = await this.use_case.showPremiumPrice()
            res.status(price.status).json(price.data)
        } catch (error) {
            next(error)
        }
    }
    
    async setPremium(req: Request, res: Response, next: NextFunction) {
        try {
            const price = await this.use_case.setpremiumPrice(req.body)
            res.status(price.status).json(price.data)
        } catch (error) {
            next(error)
        }
    }
}

export default adminController