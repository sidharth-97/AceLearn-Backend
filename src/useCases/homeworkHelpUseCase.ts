import { Questions } from "../infrastructure/database/Questions";
import HomeworkHelpRepository from "../infrastructure/repository/homeworkhelprepository";
import TutorRepository from "../infrastructure/repository/tutorRepository";

class HomeworkHelpUsecase{
    private homeworkrepository: HomeworkHelpRepository
    private tutorRepo:TutorRepository
    constructor(homeworkrepository: HomeworkHelpRepository, tutorRepo:TutorRepository) {
        this.homeworkrepository = homeworkrepository
        this.tutorRepo=tutorRepo
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
    async postSolution(data: any) {
        const question = await this.homeworkrepository.findById(data.id)
        if (question) {
            question.tutor.push(data.tutorId)
            question.solution.push({
                text: data.text,
                image: data.image,
                tutor:data.tutorId
            })
        }
        const saved = await this.homeworkrepository.save(question)
        if (saved) {
            await this.tutorRepo.payTutor(data.tutorId, 50)
            await this.tutorRepo.pushNotifications(data.tutorId, "Question Solved", `Your submittion of the qustion is successfull`, "Question")
            return {
                status: 200,
                data:question
            }
        } else {
            return {
                status: 400,
                data:"Submission failed"
            }
        }
    }
    async showUnsolved(id: string) {
        const tutor = await this.tutorRepo.findById(id)
        console.log("**************************");
        
        if (tutor) {
            const questions = await this.homeworkrepository.findAll(tutor.subject,id)
            console.log(questions," -------------------------");
            
            if (questions) {
                
                function getRandomNumber(max:number) {
                    return Math.floor(Math.random() * max);
                }
                const randomNumber = getRandomNumber(questions.length);
                console.log(randomNumber,"random number");
                
                return {
                    status: 200,
                    data:questions[randomNumber]
                }
            } else {
                return {
                    status: 404,
                    data:"No questions"
                }
            }
        } else {
            return {
                status: 401,
                data:"Not accessible"
            }
        }
    }
}

export default HomeworkHelpUsecase