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
    async findAndUpdate(tutor: Tutor): Promise<any> {
        if (tutor._id) {
            const updatedTutor = await TutorModel.findByIdAndUpdate(tutor._id, tutor, { new: true })
            return updatedTutor
        }
    }
   async findById(id: string): Promise<any> {
       const tutor = await TutorModel.findById(id)
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
}

export default TutorRepository