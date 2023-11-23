import Tutor from "../../entities/tutors";
import TutorRepositoryInterface from "../../useCases/interface/tutorRepositoryInterface";
import { TutorModel } from "../database/tutorModel";

class TutorRepository implements TutorRepositoryInterface{
   async findByEmail(email: string): Promise<any> {
        const tutor = await TutorModel.findOne({ email: email })
       if (tutor) {
           return tutor
       } else {
           return null 
       }
    }

     async save(tutor: Tutor): Promise<any> {
         const newTutor = new TutorModel(tutor)
         await newTutor.save()
         console.log("after save");
         
         return newTutor
    }
    async findAndUpdate(tutor: Tutor): Promise<any> {
        if (tutor._id) {
            const updatedTutor = await TutorModel.findByIdAndUpdate(tutor._id, tutor, { new: true })
            return updatedTutor
        }
    }
   async findById(id: string): Promise<any>{
       const tutor = await TutorModel.findById(id).populate("review.student")
       console.log(tutor,"got tutor");
       
       if (tutor) {
           return tutor
       } else {
           return null
       }
    }
    async findAll(): Promise<any> {
        const AllTutor = await TutorModel.find()
        if (AllTutor) {
            return AllTutor
        } else {
            return null
        }
    }
    async addReview(tutor: any, data: any) {
        const newReview = {
          student: data.student,
          rating: data.rating,
          description: data.description,
        };
      
        console.log(newReview, "new review");
      
        const existingIndex = tutor.review.findIndex(
          (item: any) => item.student == data.student
        );
      
        console.log(existingIndex, "existing index");
      
        if (existingIndex === -1) {
          tutor.review.push(newReview);
        } else {
          tutor.review[existingIndex] = { ...tutor.review[existingIndex], ...newReview };
        }
        
        const totalRating = tutor.review.reduce((sum: number, review: any) => sum + review.rating, 0);
        tutor.rating = totalRating / tutor.review.length;
      
        await tutor.save();
          
        return tutor;
      }
      
    async oldReview(tutor: any, student: string) {
        console.log(tutor, "1");
        console.log(student,"2");
        
        
        const existingIndex = tutor.review.findIndex((item: any) => item.student == student )
        if (existingIndex == -1) {
            return null
        } else {
            return tutor.review[existingIndex]
        }
      }
    async payTutor(tutor: any,fee:number) {
        const amount = parseInt(tutor.wallet)+fee
        tutor.wallet = amount
        const updatedTutor = await tutor.save()
        if (updatedTutor) {
            return updatedTutor
        } else {
            return null
        }

    }
}

export default TutorRepository