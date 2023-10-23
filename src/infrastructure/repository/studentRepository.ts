import studentRepositoryInterface from "../../useCases/interface/studentRepositoryInterface";
import { studentModel } from "../database/studentModel";
studentModel
import Student from "../../entities/students";

class studentRepository implements studentRepositoryInterface{

   async save(student: Student): Promise<any> {
       const newStudent = new studentModel(student)
       console.log(newStudent);
       await newStudent.save()
       return newStudent
    }
    
    async findByEmail(email: String): Promise<any> {
     const student = await studentModel.findOne({ email: email })
     if (student) {
         return student
     } else {
         return null
     }
    }
    async findAndUpdate(student: Student): Promise<any> {
        if (student._id) {
            const updatedStudent = await studentModel.findByIdAndUpdate(student._id, student, { new: true });
            return updatedStudent
        }
    }
    async findById(id: string): Promise<any> {
        const student = await studentModel.findById(id)
        if (student) {
            return student
        } else {
            return null
        }
    }
}

export default studentRepository