import adminRepositoryInterface from "../../useCases/interface/adminRepositoryInterface";
import AdminModel from "../database/adminModel";
import { studentModel } from "../database/studentModel";
import { TutorModel } from "../database/tutorModel";


class adminRepository implements adminRepositoryInterface{
    async findByEmail(email: string): Promise<any> {
        const admin = await AdminModel.findOne({ email: email })
        if (admin) {
            return admin
        } else {
            return null
        }
    }
    async findStudents(): Promise<any> {
        const students = await studentModel.find()
        if (students) {
            return students
        } else {
            return null
        }
    }


     async findTutors(): Promise<any> {
         const tutors = await TutorModel.find()
         if (tutors) {
             return tutors
         } else {
             return null
         }
    }
    async blockStudentById(id: string): Promise<any> {
          const student = await studentModel.findById(id)
        if (student) {
            return student
        } else {
            return null
        }
    }


    async blockTutorById(id: string): Promise<any> {
        console.log(id);
        
        const tutor = await TutorModel.findById(id) 
        if (tutor) {
            return tutor
        } else {
            return null
        }
    }
}

export default adminRepository