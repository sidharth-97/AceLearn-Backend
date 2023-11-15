import adminRepositoryInterface from "../../useCases/interface/adminRepositoryInterface";
import AdminModel from "../database/adminModel";
import { studentModel } from "../database/studentModel";
import { TutorModel } from "../database/tutorModel";
import AcademicInfoModel from "../database/AcademicInfoModel";


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
    async findSubject() {
        
        const newsubject = await AcademicInfoModel.findOne()
        if (newsubject) {
            return newsubject
        } else {
            return null
        }
    }

    async saveSubject(doc: any, data: any) {
        try {
            if (!doc) {
                // If the document doesn't exist, create a new one
                doc = new AcademicInfoModel();
            }
    
            if (data.subject) {
                doc.subject.push(data.subject);
            } else {
                doc.class.push(data.class);
            }
    
            const news = await doc.save();
            return news;
        } catch (error) {
            console.error(error);
            throw error; // Re-throw the error to handle it in the calling function
        }
    }

    async deleteSubject(doc: any, data: any) {
        console.log(doc, "doc");
        console.log(data, "data");
    
        if (data.subject) {
            doc.subject = doc.subject.filter((subject: string) => subject !== data.subject);
        } else {
            doc.class = doc.class.filter((classItem: string) => classItem !== data.class);
        }
    
        const updated = await doc.save();
        console.log(updated, "updated");
    
        return updated;
    }
    
}

export default adminRepository