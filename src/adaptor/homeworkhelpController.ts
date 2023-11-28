import { Request, Response } from "express";
import HomeworkHelpUsecase from "../useCases/homeWorkHelpUseCase";
import { NextFunction } from "express";
import CloudinaryUpload from "../infrastructure/utils/CloudinaryUpload";

class HomeworkHelpController{
    private homeworkhelpUsecase: HomeworkHelpUsecase
    private CloudinaryUpload: CloudinaryUpload
    constructor(homeworkhelpUsecase: HomeworkHelpUsecase,CloudinaryUpload: CloudinaryUpload) {
        this.homeworkhelpUsecase = homeworkhelpUsecase
        this.CloudinaryUpload=CloudinaryUpload
    }
    async addQuestions(req: Request, res: Response, next: NextFunction) {
        try {
            console.log(req.body,"add questions");
            let url = ""
            if (req.file) {
                const img = await this.CloudinaryUpload.upload(req.file.path, "Questions")
                url=img.secure_url
            }
            let userId = (req as any)?.user.id
            req.body.image = url
            req.body.student=userId
            const question = await this.homeworkhelpUsecase.addQuestions(req.body)
            res.status(question.status).json(question.data)
        } catch (error) {
            next(error)
        }
    }
    async studentQuestions(req: Request, res: Response, next: NextFunction) {
        try {
            let userId = (req as any)?.user.id
            const questions = await this.homeworkhelpUsecase.findByStudent(userId)
            res.status(questions.status).json(questions.data)
        } catch (error) {
            next(error)
        }
    }

    async postSolution(req: Request, res: Response, next: NextFunction) {
        try {
            console.log(req.body,"post solution-----------------------------------------");
            
            let url = ""
            if (req.file) {
                const img = await this.CloudinaryUpload.upload(req.file.path, "Questions")
                url=img.secure_url
            }
            req.body.image=url
            let userId = (req as any)?.user.id
            req.body.tutorId=userId
            const solution = await this.homeworkhelpUsecase.postSolution(req.body)
            res.status(solution.status).json(solution.data)
        } catch (error) {
            next(error)
        }
    }
    async showUnsolved(req: Request, res: Response, next: NextFunction) {
        try {
            let userId = (req as any)?.user.id

            console.log(userId,"user iiddddddddddddddddd");
            
            const questions = await this.homeworkhelpUsecase.showUnsolved(userId)
            res.status(questions.status).json(questions.data)
        } catch (error) {
            next(error)
        }
    }
}
export default HomeworkHelpController