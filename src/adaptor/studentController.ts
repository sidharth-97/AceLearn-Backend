import { Request, Response } from "express";
import StudentUseCase from "../useCases/studentUseCase";
import GenerateOTP from "../infrastructure/utils/GenerateOTP";
import SentMail from "../infrastructure/utils/sendMail";
import CloudinaryUpload from "../infrastructure/utils/CloudinaryUpload";
import fs from "fs";
import ChatUseCase from "../useCases/chatUseCase";
import TutorUseCase from "../useCases/tutorUseCase";

class studentController {
  private studentUseCase: StudentUseCase;
  private genOtp: GenerateOTP;
  private sentMail: SentMail;
  private CloudinaryUpload: CloudinaryUpload;
  private chatuseCase: ChatUseCase;
  private tutorUseCase: TutorUseCase
  constructor(
    studentUseCase: StudentUseCase,
    genOtp: GenerateOTP,
    sentMail: SentMail,
    CloudinaryUpload: CloudinaryUpload,
    chatuseCase: ChatUseCase,
    tutorUseCase: TutorUseCase
  ) {
    (this.studentUseCase = studentUseCase), (this.genOtp = genOtp);
    this.sentMail = sentMail;
    this.CloudinaryUpload = CloudinaryUpload;
    this.chatuseCase = chatuseCase;
    this.tutorUseCase = tutorUseCase
  }

  async signup(req: Request, res: Response) {
    try {
      const otp = await this.genOtp.generateOtp(4);
      console.log(otp, "otp");

      this.sentMail.sendMail(req.body.username, req.body.email, otp);

      const student = await this.studentUseCase.signup(req.body);

      req.app.locals.otp = otp;

      res.status(student.status).json(student.data);
    } catch (error) {
      res.status(401).json(error);
    }
  }

  async signupStep2(req: Request, res: Response) {
    try {
      console.log(req.body);
      let url = "";
      if (req.file) {
        const img = await this.CloudinaryUpload.upload(
          req.file.path,
          "student-image"
        );
        url = img.secure_url;
      }
      const data = {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        mobile: req.body.mobile,
        image: url,
      };
      console.log(data, "data form signup form 2");

      if (req.body.otp != req.app.locals.otp) {
        res.status(401).json("password doesnt match");
      }

      const result = await this.studentUseCase.signup2(data);
      if (req?.file) {
        fs.unlink(req.file.path, (err) => {
          if (err) {
            console.error("Error while unlinking:", err);
          } else {
            console.log("File has been deleted successfully");
          }
        });
      } else {
        console.error("No file to delete");
      }
      console.log("below");

      res.status(result.status).json(result.data);
    } catch (error) {
      res.status(401).json(error);
    }
  }

  async login(req: Request, res: Response) {
    try {
      console.log("abcd");

      const student = await this.studentUseCase.login(req.body);
      if (student) {
        res.cookie("Studentjwt", student.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== "development",
          sameSite: "strict",
          maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        res.status(student?.status).json(student.data);
      }
    } catch (error) {
      res.status(401).json(error);
    }
  }
  async logout(req: Request, res: Response) {
    try {
      res.cookie("Studentjwt", "", {
        httpOnly: true,
        expires: new Date(0),
      });
      res.status(200).json("Student Logged Out");
    } catch (error) {
      res.status(401).json(error);
    }
  }
  async editProfile(req: Request, res: Response) {
    try {
      const data = req.body;
      console.log(data, "this is the didofisfjojif");

      let url = "";
      if (req.file) {
        const img = await this.CloudinaryUpload.upload(
          req.file.path,
          "student-image"
        );
        url = img.secure_url;
      }
      const formdata = {
        email: req.body.email,
        username: req.body.username,
        newpassword: req.body.newpassword,
        currpassword: req.body.currpassword,
        mobile: req.body.mobile,
        image: url,
      };
      console.log(formdata, "form data in controller");
      
      const student = await this.studentUseCase.editProfile(formdata);
      if (req?.file) {
        fs.unlink(req.file.path, (err) => {
          if (err) {
            console.error("Error while unlinking:", err);
          } else {
            console.log("File has been deleted successfully");
          }
        });
      } else {
        console.error("No file to delete");
      }
      res.status(student.status).json(student.data);
    } catch (error) {
      res.status(401).json(error);
    }
  }

  async getStudentInfo(req: Request, res: Response) {
    try {
      const studentId = req.params.id;
      const result = await this.studentUseCase.getStudentData(studentId);
      if (result) {
        res.status(result.status).json(result.data);
      }
    } catch (error) {
      res.status(401).json(error);
    }
  }

  async showNotifications(req: Request, res: Response) {
    try {
      console.log("notifications");
      
      const notifications = await this.studentUseCase.showNotifications(req.params.id)
      res.status(notifications.status).json(notifications.data)
    } catch (error) {
      res.status(401).json(error)
    }
  }

  async newConversation(req: Request, res: Response) {
    try {
      const members = [req.body.senderId, req.body.receiverId]
      const conversation = await this.chatuseCase.newConversation(members)
      res.status(conversation?.status).json(conversation?.data)
    } catch (error) {
      res.status(401).json(error)
    }
  }

  async getConversations(req: Request, res: Response) {
    try {
      console.log(req.params.id);
      
      const conversations = await this.chatuseCase.getConversations(req.params.id)
      res.status(conversations.status).json(conversations.data)
    } catch (error) {
      res.status(401).json(error)
    }
  }
  async addMessage(req: Request, res: Response) {
    try {
      const message = await this.chatuseCase.addMessage(req.body)
      res.status(message.status).json(message.data)
    } catch (error) {
      res.status(401).json(error)
    }
  }
  async getMessages(req: Request, res: Response) {
    try {
      const messages = await this.chatuseCase.getMessages(req.params.id)
      res.status(messages.status).json(messages.data)
    } catch (error) {
      res.status(401).json(error)
    }
  }


  async getAllUsers(req: Request, res: Response) {
    try {
      console.log("getall users");
      
      const tutor = await this.tutorUseCase.getTutorData(req.params.id)
      if (tutor.status != 200) {
        const student = await this.studentUseCase.getStudentData(req.params.id)
        res.status(200).json(student.data)
      } else {
        res.status(200).json(tutor.data)
      }
    } catch (error) {
      res.status(401).json(error)
    }
  }
}

export default studentController;
