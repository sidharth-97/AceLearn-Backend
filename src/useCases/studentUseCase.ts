import Student from "../entities/students";
import Encrypt from "../infrastructure/passwordRepository/hashpassword";
import jwtToken from "../infrastructure/passwordRepository/jwt";
import PaymentRepository from "../infrastructure/repository/paymentRepository";
import studentRepository from "../infrastructure/repository/studentRepository";
import * as schedule from 'node-schedule';
import { sendNotification } from "../infrastructure/utils/sendNotifications";

class StudentUseCase {
  private Encrypt: Encrypt;
  private studentRepository: studentRepository;
  private JWTToken: jwtToken;
  private PaymentRepo:PaymentRepository
  constructor(
    Encrypt: Encrypt,
    studentRepository: studentRepository,
    JWTToken: jwtToken,
    PaymentRepo:PaymentRepository
  ) {
    (this.Encrypt = Encrypt),
      (this.studentRepository = studentRepository),
      (this.JWTToken = JWTToken);
    this.PaymentRepo=PaymentRepo
  }

  async signup(student: Student) {
    console.log("here");

    const isExisting = await this.studentRepository.findByEmail(student.email);
    if (isExisting) {
      return {
        status: 401,
        data: "Student already exists",
      };
    } else {
      //     const newPassword = await this.Encrypt.createHash(student.password)
      //     const newStudent = { ...student, password: newPassword }
      //     await this.studentRepository.save(newStudent)
      return {
        status: 200,
        data: student,
      };
    }
  }

  async signup2(student: Student) {
    console.log("here123");

    const newPassword = await this.Encrypt.createHash(student.password);
    const newStudent = {
      username: student.username,
      email: student.email,
      password: newPassword,
      mobile: student.mobile,
      image: student.image
    };
    await this.studentRepository.save(newStudent);
    return {
      status: 200,
      data: newStudent,
    };
  }

  async login(student: Student) {
    try {      
      const studentLog = await this.studentRepository.findByEmail(
        student.email
      );
      if (studentLog.isBlocked) {
        return {
          status: 403,
          data: "Blocked by admin",
        };
      }
      if (studentLog) {

        if (await this.Encrypt.compare(student.password, studentLog.password)) {
          studentLog.token = student.FCMToken          
          await this.studentRepository.save(studentLog)
          const token = this.JWTToken.createJWT(studentLog._id, "student");
          return {
            status: 200,
            data: studentLog,
            token: token,
          };
        } else {
          return {
            status: 403,
            data: {
              data: "Wrong Password",
            },
          };
        }
      } else {
        return {
          status: 403,
          data: "Email Wrong",
        };
      }
    } catch (error) {
      return {
        status: 404,
        data: error,
      };
    }
  }

  async editProfile(student: any, id: string) {
    console.log(id);
    
    const Editstudent = await this.studentRepository.findById(id);
    console.log(Editstudent, "edit student");
    
    if (Editstudent) {
      if (student.currentPassword) {
        const isPasswordCorrect = await this.Encrypt.compare(
          student.currentPassword,
          Editstudent.password
        );

        if (!isPasswordCorrect) {
          return {
            status: 401,
            data: "Incorrect current password",
          };
        }
      }

      // Update other properties if needed
      if (student.username) {
        Editstudent.username = student.username;
      }

      if (student.mobile) {
        Editstudent.mobile = student.mobile;
      }

      if (student.newPassword) {
        Editstudent.password = await this.Encrypt.createHash(
          student.newPassword
        );
      }
      if (student.image) [(Editstudent.image = student.image)];
      const updatedStudent = await Editstudent.save();

      return {
        status: 200,
        data: updatedStudent,
      };
    } else {
      return {
        status: 404,
        data: "Student not found",
      };
    }
  }

  async getStudentData(id: string) {
    const student = await this.studentRepository.findById(id);
    if (student) {
      return {
        status: 200,
        data: student,
      };
    } else {
      return {
        status: 404,
        data: student,
      };
    }
  }

  async walletAmt(data: any) {
    const student = await this.studentRepository.findById(data.id)
    const updated = await this.studentRepository.walletAmt(student, data.fee)
   
    if (updated) {

      return {
        status: 200,
        data: updated
      }
    } else {
      return {
        status: 400,
        data: "Error occured"
      }
    }
  }

  async showNotifications(id: string) {
    const student = await this.studentRepository.findById(id)
    if (student.notifications) {
      return {
        status: 200,
        data: student.notifications
      }
    } else {
      return {
        status: 401,
        data: "No new notifications"
      }
    }
  }

  async forgotPasswordStep1(email: string) {
    console.log("forgot password");
    
    const student = await this.studentRepository.findByEmail(email)
    if (student) {
      return {
        status: 200,
        data: "Student exists"
      }
    } else {
      return {
        status: 401,
        data: "Not exists"
      }
    }
  }


  async forgotPasswordStep3(data: any) {
    const student = await this.studentRepository.findByEmail(data.email)
    if (student) {
      student.password = await this.Encrypt.createHash(data.password)
      await this.studentRepository.save(student)
      return {
        status: 200,
        data:"Password change success"
      }
    } else {
      return {
        status: 401,
        data:"Something went wrong"
      }
    }
 }
  
 
 async buyPremium(data: any) {
   console.log(data, "from buy premium");
 
   const payment = await this.PaymentRepo.ConfirmPayment(data);
   const student = await this.studentRepository.findById(data.id);
 
   if (payment && student) {
     student.premium = true;
 
     const newStudent = await this.studentRepository.save(student);
 
     if (newStudent) {
       schedule.scheduleJob('premiumExpiry', new Date(Date.now() + 28 * 24 * 60 * 60 * 1000), async () => {
         student.premium = false;
         await this.studentRepository.save(student);
         console.log(`Premium status set to false for student ID ${student.id}`);
       });
 
       return {
         status: 200,
         data: payment,
       };
     } else {
       return {
         status: 200,
         data: "Failed",
       };
     }
   } else {
     return {
       status: 400,
       data: "Failed",
     };
   }
 }
  
}

export default StudentUseCase;
