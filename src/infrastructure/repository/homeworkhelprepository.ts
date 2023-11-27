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
    async findAll(subjects: string[]): Promise<any> {
        console.log(subjects);
        
        const questions = await QuestionsModel.aggregate([
          {
            $match: {
              "subject": { $in: subjects },
              "tutor": { $exists: false}
            }
          }
        ]);
        return questions;
      }
      
}

export default HomeworkHelpRepository