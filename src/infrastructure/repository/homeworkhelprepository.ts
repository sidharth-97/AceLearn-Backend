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
          const { _id } = data;
      
          if (_id) {
            // If _id is present, it means the document already exists, so update it
            const done = await QuestionsModel.findByIdAndUpdate(_id, data, { new: true });
      
            if (done) {
              console.log("Document updated:", done);
              return done;
            } else {
              console.log("Failed to update document.");
              return null;
            }
          } else {
            // If _id is not present, it means it's a new document, so create it
            const newQuestions = new QuestionsModel(data);
            const done = await newQuestions.save();
      
            if (done) {
              console.log("New document created:", done);
              return done;
            } else {
              console.log("Failed to create new document.");
              return null;
            }
          }
        } catch (error) {
          console.log(error);
          return null;
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
                        $expr: { $lte: [{ $size: { $ifNull: ["$solution", []] } }, 2] },
                        views: { $nin: [tutorId] }
                    }
                },
                {
                    $addFields: {
                        isTutorAssigned: { $in: [tutorId, "$tutor"] }
                    }
                },
                {
                    $match: {
                        isTutorAssigned: false
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