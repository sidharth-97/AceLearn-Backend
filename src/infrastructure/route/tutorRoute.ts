
import TutorController from "../../adaptor/tutorController";
import TutorUseCase from "../../useCases/tutorUseCase";
import Encrypt from "../passwordRepository/hashpassword";
import jwtToken from "../passwordRepository/jwt";
import TutorRepository from "../repository/tutorRepository";
import express from "express";
import GenerateOTP from "../utils/GenerateOTP";
import SentMail from "../utils/sendMail";
import { protectTutor, verifyToken } from "../middlewares/authMiddleware";
import { ImageUpload } from "../config/multer";
import CloudinaryUpload from "../utils/CloudinaryUpload";
import scheduleController from "../../adaptor/scheduleController";
import ScheduleUsecase from "../../useCases/sheduleUsecase";
import ScheduleRepository from "../repository/scheduleRepository";
import JobRepository from "../repository/jobRepository";
import JobController from "../../adaptor/jobController";
import JobUseCase from "../../useCases/jobUsecase";
import PaymentRepository from "../repository/paymentRepository";
import StudentUseCase from "../../useCases/studentUseCase";
import studentRepository from "../repository/studentRepository";
import ConversationRepository from "../repository/conversationRepository";
import MessageRepository from "../repository/messageRepository";
import ChatUseCase from "../../useCases/chatUseCase";
import HomeworkHelpRepository from "../repository/homeworkhelprepository";
import HomeworkHelpUsecase from "../../useCases/homeworkHelpUseCase";
import HomeworkHelpController from "../../adaptor/homeworkhelpController";
import LiveClassUsecase from "../../useCases/liveClassUsecase";
import LiveClassRepository from "../repository/liveClassRepository";

const repository = new TutorRepository()
const encrypt = new Encrypt()
const jwt = new jwtToken()
const generateOtp = new GenerateOTP()
const sendMail = new SentMail()
const Cloudinary=new CloudinaryUpload()
const paymentRepository = new PaymentRepository()
const use_case = new TutorUseCase(repository, jwt, encrypt,paymentRepository)



const scheduleRepository = new ScheduleRepository()
const StudentRepository = new studentRepository()
const studentUseCase=new StudentUseCase(encrypt,StudentRepository,jwt,paymentRepository)
const sheduleUsecase=new ScheduleUsecase(scheduleRepository,paymentRepository,repository,StudentRepository)
const schedulecontrol = new scheduleController(sheduleUsecase, studentUseCase, use_case)

const conversationRepository = new ConversationRepository()
const messageRepository = new MessageRepository()
const chatuseCase=new ChatUseCase(conversationRepository,messageRepository,StudentRepository,repository)

const jobRepository = new JobRepository()
const jobUseCase = new JobUseCase(jobRepository)
const Jobcontroller = new JobController(jobUseCase,sheduleUsecase)
const liveClassRepo=new LiveClassRepository()
const liveClass=new LiveClassUsecase(liveClassRepo,paymentRepository,StudentRepository)
const controller = new TutorController(use_case, generateOtp, sendMail, Cloudinary, sheduleUsecase, chatuseCase,liveClass)

const homeworkHelpRepo = new HomeworkHelpRepository()
const homeWorkHelpUseCase = new HomeworkHelpUsecase(homeworkHelpRepo,repository)
const homeworkHelpController=new HomeworkHelpController(homeWorkHelpUseCase,Cloudinary)

const tutorRouter = express.Router()

tutorRouter.post("/signup", (req, res,next) => controller.signup(req, res,next))
tutorRouter.post("/signupfinal",(req,res,next)=>controller.signupStep2(req,res,next))
tutorRouter.post("/login", (req, res,next) => controller.login(req, res,next))
tutorRouter.post("/logout", (req, res,next) => controller.logout(req, res,next))
tutorRouter.get("/tutor-details/:id",(req, res,next) => controller.getTutorInfo(req,res,next))
tutorRouter.put('/edit-profile', protectTutor, ImageUpload.single('image'), (req, res,next) => controller.editProfile(req, res,next))
tutorRouter.put("/tutor-payment", (req, res,next) => controller.addTutorPayment(req, res,next))
tutorRouter.get("/notifications/:id",protectTutor, (req, res, next) => controller.showNotifications(req, res, next))
tutorRouter.post("/buy-tutor-premium", protectTutor,(req, res, next) => controller.buyPremium(req, res, next))
tutorRouter.post("/forget-password-step-1", (req, res, next) => controller.forgotPasswordStep1(req, res, next))
tutorRouter.post("/forget-password-step-2", (req, res, next) => controller.forgotPasswordStep2(req, res, next))
tutorRouter.post("/forget-password-final", (req, res, next) => controller.forgetPasswordStep3(req, res, next))
//for common
tutorRouter.get("/alltutors", (req, res,next) => controller.getAllTutors(req, res,next))
//for schedule
tutorRouter.post('/scheduledate', (req, res,next) => schedulecontrol.scheduleTime(req, res,next))
tutorRouter.post('/changeSchedule', (req, res,next) => schedulecontrol.cancelSchedulebyTutor(req, res,next))
tutorRouter.post("/cancel-booking", (req, res, next) => schedulecontrol.cancelSchedulebyStudent(req, res, next))
tutorRouter.get("/tutor-sales", protectTutor, (req, res, next) => controller.getTutorSales(req, res, next))
tutorRouter.get("/tutor-avilable/:id",(req,res,next)=>schedulecontrol.tutorAvailable(req,res,next))
// tutorRouter.post('/booktutor', (req, res) => schedulecontrol.BookTutor(req, res))
tutorRouter.get('/tutorschedule/:id',(req,res,next)=>schedulecontrol.TutorSchedule(req,res,next))
//for job posting
tutorRouter.get('/getallposting', (req, res,next) => Jobcontroller.getAllJobs(req, res,next))
tutorRouter.post('/applytutorjob',protectTutor, (req, res,next) => Jobcontroller.applyJobs(req, res,next))
//review
tutorRouter.post("/add-review",(req,res,next)=>controller.addReview(req,res,next))
tutorRouter.get("/get-review/:id", (req, res,next) => controller.getTutorReview(req, res,next))
tutorRouter.get("/old-review/:id",verifyToken, (req, res,next) => controller.oldReview(req, res,next))
//chat section
tutorRouter.post('/conversation', (req, res,next) => controller.newConversation(req, res,next))
tutorRouter.get('/get-conversations/:id', (req, res,next) => controller.getConversations(req, res,next))
tutorRouter.post('/add-message',ImageUpload.single('image'), (req, res,next) => controller.addMessage(req, res,next))
tutorRouter.get("/get-messages/:id", (req, res, next) => controller.getMessages(req, res, next))
//homework help 
tutorRouter.post("/submit-solution", protectTutor, ImageUpload.single('image'), (req, res, next) => homeworkHelpController.postSolution(req, res, next))
tutorRouter.get("/show-unsolved", (protectTutor), (req, res, next) => homeworkHelpController.showUnsolved(req, res, next))
//live class
tutorRouter.post("/schedule-live-class", protectTutor, (req, res, next) => controller.createLiveClass(req, res, next))
tutorRouter.get("/show-liveclass-schedule",protectTutor,(req,res,next)=>controller.liveclassSchedule(req,res,next))
tutorRouter.post("/cancel-liveclass/:id",(req,res,next)=>controller.liveClassCancel(req,res,next))

export default tutorRouter