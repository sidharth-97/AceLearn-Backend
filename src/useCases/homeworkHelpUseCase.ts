import { Questions } from "../infrastructure/database/Questions";
import HomeworkHelpRepository from "../infrastructure/repository/homeworkhelprepository";

class HomeworkHelpUsecase{
    private homeworkrepository: HomeworkHelpRepository
    constructor(homeworkrepository: HomeworkHelpRepository) {
        this.homeworkrepository=homeworkrepository
    }
    async addQuestions(Questions: Questions) {
        const questions = await this.homeworkrepository.save(Questions)
        if (questions) {
            return {
                status: 200,
                data:questions
            }
        } else {
            return {
                status: 401,
                data:"Failed"
            }
        }
    }
    async findByStudent(id: string) {
        const questions = await this.homeworkrepository.findByStudent(id)
        if (questions) {
            return {
                status: 200,
                data:questions
            }
        } else {
            return {
                status: 400,
                data:"No questions posted"
            }
        }
    }
}

export default HomeworkHelpUsecase