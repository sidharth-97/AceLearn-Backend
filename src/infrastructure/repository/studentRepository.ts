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
}

export default studentRepository