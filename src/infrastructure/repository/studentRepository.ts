import studentRepositoryInterface from "../../useCases/interface/studentRepositoryInterface";
import { studentModel } from "../database/studentModel";
studentModel
import Student from "../../entities/students";

class studentRepository implements studentRepositoryInterface{

    async save(student: Student): Promise<any> {
        try {
            console.log(student);
            
            const newStudent = new studentModel(student);
            console.log(newStudent, "newStudent");
    
            // Await the save operation and capture the result
            const savedStudent = await newStudent.save();
            
            console.log("Student saved:", savedStudent);
            return savedStudent;
        } catch (error) {
            console.error("Error saving student:", error);
            // Handle the error accordingly, you might want to throw it or return a specific value to indicate failure.
            throw error; // For example, rethrow the error to the caller
        }
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
    async walletAmt(student:any,amt:any) {
        const amount = parseInt(student.wallet) + amt
        student.wallet = amount
        console.log(student,"before noti");
        
        student.notifications.push({
            title: "Amount credited",
            content: `An amount of ${amt} credited to your wallet`,
            type: "wallet",
        })
        console.log(student,"after noti");
        
        const updatedStudent = await student.save()
        if (updatedStudent) {
            return updatedStudent
        } else {
            return null
        }
    }

}

export default studentRepository