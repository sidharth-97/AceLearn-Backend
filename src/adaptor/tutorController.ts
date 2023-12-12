import { Request, Response,NextFunction } from "express"
import TutorUseCase from "../useCases/tutorUseCase"
import GenerateOTP from "../infrastructure/utils/GenerateOTP"
import SentMail from "../infrastructure/utils/sendMail"
import fs from 'fs'
import CloudinaryUpload from "../infrastructure/utils/CloudinaryUpload"
import ScheduleUsecase from "../useCases/sheduleUsecase"
import ChatUseCase from "../useCases/chatUseCase"
import LiveClassUsecase from "../useCases/liveClassUsecase"

interface TutorData {
    page: number;
    limit: number;
    subject: string; 
    minFee?: number;
    maxFee?: number;
    searchQuery?: string;
    sortValue?: string;
}

class TutorController{
    private useCase: TutorUseCase
    private genOtp: GenerateOTP
    private sentMail: SentMail
    private CloudinaryUpload: CloudinaryUpload
    private scheduleUsecase: ScheduleUsecase
    private chatuseCase: ChatUseCase
    private liveClassUsecase:LiveClassUsecase
    constructor(useCase: TutorUseCase,genOtp: GenerateOTP,sentMail:SentMail,CloudinaryUpload:CloudinaryUpload,scheduleUsecase:ScheduleUsecase,chatuseCase:ChatUseCase,liveClassUsecase:LiveClassUsecase) {
        this.useCase = useCase
        this.genOtp = genOtp
        this.sentMail = sentMail
        this.CloudinaryUpload = CloudinaryUpload
        this.scheduleUsecase = scheduleUsecase
        this.chatuseCase = chatuseCase
        this.liveClassUsecase=liveClassUsecase
    }
    async signup(req: Request, res: Response,next:NextFunction) {
        try {
            const otp = await this.genOtp.generateOtp(4)
            console.log(otp);
            
            this.sentMail.sendMail(req.body.name,req.body.email,otp)
            const tutor = await this.useCase.signup(req.body)
            req.app.locals.Tutordata = req.body
            req.app.locals.otp = otp
            console.log(tutor);
        if (tutor) {
           res.status(tutor.status).json(tutor.data)
       } 
       } catch (error) {
        next(error)
        }
    }

    async signupStep2(req: Request, res: Response,next:NextFunction) {
        try {
            console.log("hreee");
            
            if (req.body.otp != req.app.locals.otp) {
                res.status(401).json("otp doesnt match")
            } else {
                const { subject,rate,bio,fee,mobile,qualifications } = req.body             
                const tutor = { ...req.app.locals.Tutordata, subject, rate, bio, fee,mobile,qualifications }
                console.log(tutor,"checkkkk");
                
                const result = await this.useCase.signup2(tutor)
                res.status(result.status).json(result.data)
            }
        } catch (error) {
            console.log("errro");
            
            next(error)
        }
    }



    async login(req: Request, res: Response,next:NextFunction) {
        try {
            const tutor = await this.useCase.login(req.body)
            res.cookie('Tutorjwt', tutor.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== 'development',
                sameSite: 'strict',
                maxAge: 30 * 24 * 60 * 60 * 1000,
              });
            res.status(tutor.status).json(tutor.data)
        } catch (error) {
            next(error)
        }
    }
    async logout(req: Request, res: Response,next:NextFunction) {
        try {
            res.cookie('Tutorjwt', "", {
                httpOnly: true,
                expires:new Date(0)
            })
            res.status(200).json("Tutor Logged Out")
        } catch (error) {
            next(error)
        }
    }

    async editProfile(req: Request, res: Response,next:NextFunction) {
        try {
            console.log("edit tutor");
            let userId = (req as any)?.user.id
            console.log(req.body);
            let url=''
            if (req.file) {
               
                
                const img = await this.CloudinaryUpload.upload(req.file.path, 'tutor-image');
              
                 url=img.secure_url
            } else {
                url=req.body.image
            }
            const data = {
                email: req.body.email,
                name:req.body.name,
                password: req.body.password,
                oldPassword:req.body.oldPassword,
                mobile: req.body.mobile,
                subject: req.body.subject,
                fee: req.body.fee,
                bio: req.body.bio,
                image:url,
            }
           
            
            console.log(data);
            if (req?.file) {
                fs.unlink(req.file.path, (err) => {
                    if (err) {
                        console.error('Error while unlinking:', err);
                    } else {
                        console.log('File has been deleted successfully');
                    }
                });
            } else {
                console.error("No file to delete");
            }
            
            const tutor = await this.useCase.editprofile(data,userId)
            res.status(tutor.status).json(tutor.data)
        } catch (error) {
            next(error)            
        }
    }

    async getTutorInfo(req: Request, res: Response,next:NextFunction) {
        try {
          
            const tutorId = req.params.id
            const result = await this.useCase.getTutorData(tutorId)
            
            
            if (result) {
                res.status(result.status).json(result.data)
            }
            
        } catch (error) {
            next(error)            
        }
    }

    async getAllTutors(req: Request, res: Response,next:NextFunction) {
        try {
            console.log("all tutors");
            
            const data: TutorData = {
                page: Number(req.query.page) || 1,
                limit: Number(req.query.limit) || 3,
                subject: req.query.subject as string,
                minFee: req.query.minFee ? Number(req.query.minFee) : undefined,
                maxFee: req.query.maxFee ? Number(req.query.maxFee) : undefined,
                searchQuery: req.query.search as string,
                sortValue: req.query.sort as string,
            }
            console.log(data);
            
            const tutor = await this.useCase.getAllTutor(data)
            if (tutor) {
                res.status(tutor.status).json(tutor.data)
            }
        } catch (error) {
            res.status(404).json(error)
        }
    }
    async addReview(req: Request, res: Response,next:NextFunction) {
        try {
            console.log(req.body,"this is from controller");
            
            const review = await this.useCase.addReview(req.body)
            res.status(review.status).json(review.data)
        } catch (error) {
            res.status(404).json(error)
        }
    }
    async getTutorReview(req: Request, res: Response,next:NextFunction) {
        try {
            
            const reviews = await this.useCase.getTutorReview(req.params.id)
            res.status(reviews.status).json(reviews.data)
        } catch (error) {
            res.status(404).json(error)
        }
    }
    async oldReview(req: Request, res: Response,next:NextFunction) {
        try {    
            const token = req.cookies.Studentjwt
            const tutor=req.params.id
            const response = await this.useCase.oldReview({tutor:tutor,student:token})
            res.status(response?.status).json(response?.data)
        } catch (error) {
            res.status(404).json(error)
        }
    }
    async addTutorPayment(req: Request, res: Response,next:NextFunction) {
        try {
            console.log(req.body,"req.body");
            
            const fees = await this.scheduleUsecase.getTutorfee(req.body.tutor, req.body.id)
            console.log(fees,"fees");
            
            const tutor = await this.useCase.PayTutor(req.body.tutor, fees)
            res.status(tutor.status).json(tutor.data)
        } catch (error) {
            res.status(404).json(error)
        }
    }

    async showNotifications(req: Request, res: Response,next:NextFunction) {
        try {
            const notifications = await this.useCase.showNotifications(req.params.id)
            res.status(notifications.status).json(notifications.data)
        } catch (error) {
            res.status(404).json(error)
        }
    }
    async newConversation(req: Request, res: Response,next:NextFunction) {
        try {
          const members=[req.body.senderId,req.body.receiverId]
          const conversation = await this.chatuseCase.newConversation(members)
          res.status(conversation?.status).json(conversation?.data)
        } catch (error) {
          next(error)
        }
      }
    
      async getConversations(req: Request, res: Response,next:NextFunction) {
        try {
          console.log(req.params.id);
          
          const conversations = await this.chatuseCase.getConversations(req.params.id)
          res.status(conversations.status).json(conversations.data)
        } catch (error) {
          next(error)
        }
      }
      async addMessage(req: Request, res: Response,next:NextFunction) {
          try {
            console.log(req.body,"addmessage///////////////////////////////");
            let url = "";
            if (req.file) {
              const img = await this.CloudinaryUpload.upload(
                req.file.path,
                "chat-image"
              );
              url = img.secure_url;
            }
            const data = {
              ...req.body,
              image: url,
            };
          const message = await this.chatuseCase.addMessage(data)
          res.status(message.status).json(message.data)
        } catch (error) {
          next(error)
        }
      }
      async getMessages(req: Request, res: Response,next:NextFunction) {
        try {
          const messages = await this.chatuseCase.getMessages(req.params.id)
          res.status(messages.status).json(messages.data)
        } catch (error) {
          next(error)
        }
    }
    
    async getTutorSales(req: Request, res: Response, next: NextFunction) {
        try {
            let userId = (req as any)?.user.id
            const schedules = await this.scheduleUsecase.TutorSales(userId)
            res.status(schedules.status).json(schedules.data)
        } catch (error) {
            next(error)
        }
    }

    async buyPremium(req: Request, res: Response, next: NextFunction) {
        try {
            let userId = (req as any)?.user.id
            req.body.id = userId
            const response = await this.useCase.buyPremium(req.body)
            res.status(response.status).json(response.data)
        } catch (error) {
            next(error)
        }
    }
    async forgotPasswordStep1(req: Request, res: Response, next: NextFunction) {
        try {
          const otp = await this.genOtp.generateOtp(4);
          this.sentMail.sendMail(req.body.username, req.body.email, otp);
    
          const tutor = await this.useCase.forgotPasswordStep1(req.body.email)
          req.app.locals.otp = otp;
          console.log(req.app.locals.otp,"from step one");
        res.status(tutor.status).json(tutor.data)
        } catch (error) {
          next(error)
        }
      }
      async forgotPasswordStep2(req: Request, res: Response, next: NextFunction) {
        try {
          if (req.body.otp != req.app.locals.otp) {
            console.log(req.body.otp);
            console.log(req.app.locals.otp);
            
            
            res.status(401).json("OTP doesnt match");
          } else {
            res.status(200).json("Otp verification success")
          }
         
        } catch (error) {
          next(error)
        }
      }
      
      async forgetPasswordStep3(req: Request, res: Response, next: NextFunction){
        try {
          const student = await this.useCase.forgotPasswordStep3(req.body)
          res.status(student.status).json(student.data)
        } catch (error) {
          next(error)
        }
    }
    
    async createLiveClass(req: Request, res: Response, next: NextFunction) {
        
        
        try {
            let userId = (req as any)?.user.id
            console.log(userId,"got userid");
            
            req.body.tutor = userId
            const classes = await this.liveClassUsecase.createLiveClass(req.body)
            res.status(classes.status).json(classes.data)
        } catch (error) {
            next(error)
        }
    }

}

export default TutorController