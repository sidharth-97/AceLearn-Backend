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
         return newTutor
    }
}

export default TutorRepository