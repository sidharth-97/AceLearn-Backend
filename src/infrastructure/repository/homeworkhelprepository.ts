import homeworkHelpRepoInterface from "../../useCases/interface/homeworkhelprepoInterface";
import { QuestionsModel, Questions } from "../database/Questions";

class HomeworkHelpRepository implements homeworkHelpRepoInterface{
     async findById(id: string): Promise<any> {
         let Questions = await QuestionsModel.findById(id)
         if (Questions) {
             return Questions
         } else {
             return null
         }
    }
    async save(data: Questions): Promise<any> {
        try {
            const newQuestions = new QuestionsModel(data)
            const done = await newQuestions.save()
            if (done) {
                return done
            } else {
                return null
            }
        } catch (error) {
            console.log(error);
            
        }
    }
     async findByStudent(id: string): Promise<any> {
         const studentQuestions = await QuestionsModel.find({ student: id })
         if (studentQuestions) {
             return studentQuestions
         } else {
             return null
         }
    }
    async findAll(subjects: string[], tutorId: string): Promise<any> {
        console.log(tutorId,"99999");
    
        try {
            const questions = await QuestionsModel.aggregate([
                {
                    $match: {
                        "subject": { $in: subjects },
                        $expr: { $lte: [{ $size: { $ifNull: ["$solution", []] } }, 2] }
                    }
                },
                {
                    $addFields: {
                        isTutorAssigned: { $in: [tutorId, "$tutor"] }
                    }
                },
                {
                    $match: {
                        isTutorAssigned: true
                    }
                }
            ]);
    
            console.log(questions, "ques");
    
            return questions;
        } catch (error) {
            console.log(error);
        }
    }
         
}

export default HomeworkHelpRepository