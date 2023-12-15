import studentController from "../../adaptor/studentController";
import studentRepository from "../repository/studentRepository";
import StudentUseCase from "../../useCases/studentUseCase";
import Encrypt from "../passwordRepository/hashpassword";
import express from "express";
import jwtToken from "../passwordRepository/jwt";
import GenerateOTP from "../utils/GenerateOTP";
import { ImageUpload } from "../config/multer";
import SentMail from "../utils/sendMail";
import { verifyToken } from "../middlewares/authMiddleware";
import JobRepository from "../repository/jobRepository";
import JobUseCase from "../../useCases/jobUsecase";
import JobController from "../../adaptor/jobController";
import ScheduleRepository from "../repository/scheduleRepository";
import ScheduleUsecase from "../../useCases/sheduleUsecase";
import scheduleController from "../../adaptor/scheduleController";
import PaymentRepository from "../repository/paymentRepository";
import CloudinaryUpload from "../utils/CloudinaryUpload";
import TutorUseCase from "../../useCases/tutorUseCase";
import TutorRepository from "../repository/tutorRepository";
import ConversationRepository from "../repository/conversationRepository";
import ChatUseCase from "../../useCases/chatUseCase";
import MessageRepository from "../repository/messageRepository";
import HomeworkHelpRepository from "../repository/homeworkhelprepository";
import HomeworkHelpUsecase from "../../useCases/homeworkHelpUseCase";
import HomeworkHelpController from "../../adaptor/homeworkhelpController";
import LiveClassRepository from "../repository/liveClassRepository";
import LiveClassUsecase from "../../useCases/liveClassUsecase";

const repository = new studentRepository()
const encrypt = new Encrypt()
const jwt = new jwtToken()
const generateOtp = new GenerateOTP()
const paymentRepository=new PaymentRepository()
const use_case = new StudentUseCase(encrypt, repository, jwt,paymentRepository)
const sentMail = new SentMail
const Cloudinary = new CloudinaryUpload()

const conversationRepository = new ConversationRepository()
const messageRepository=new MessageRepository()
const chatUseCase = new ChatUseCase(conversationRepository, messageRepository)

const tutorRepository=new TutorRepository()
const tutorUseCase = new TutorUseCase(tutorRepository, jwt, encrypt, paymentRepository)

const liveClassRepository = new LiveClassRepository()
const liveClassUsecase=new LiveClassUsecase(liveClassRepository,paymentRepository,repository)

const controller = new studentController(use_case, generateOtp, sentMail,Cloudinary,chatUseCase,tutorUseCase,liveClassUsecase)

const jobRepository = new JobRepository()
const jobUseCase = new JobUseCase(jobRepository)
const Jobcontroller = new JobController(jobUseCase)



const scheduleRepository = new ScheduleRepository()

const sheduleUsecase = new ScheduleUsecase(scheduleRepository,paymentRepository,tutorRepository,repository)
const schedulecontroller = new scheduleController(sheduleUsecase, use_case, tutorUseCase)

const homeworkHelpRepo = new HomeworkHelpRepository()
const homeWorkHelpUseCase = new HomeworkHelpUsecase(homeworkHelpRepo,tutorRepository)
const homeworkHelpController=new HomeworkHelpController(homeWorkHelpUseCase,Cloudinary)

const studentRouter = express.Router()

studentRouter.post("/signup", (req, res,next) => controller.signup(req, res,next))
studentRouter.post("/signupfinal", ImageUpload.single('image'),(req, res,next) => controller.signupStep2(req, res,next))
studentRouter.post("/login", (req, res,next) => controller.login(req, res,next))
studentRouter.post("/logout",(req,res,next)=>controller.logout(req,res,next))
studentRouter.put("/edit-profile",verifyToken, ImageUpload.single('image'),(req,res,next)=>controller.editProfile(req,res,next))
studentRouter.get('/student-details/:id', verifyToken, (req, res,next) => controller.getStudentInfo(req, res,next))
studentRouter.get("/notifications/:id", (req, res, next) => controller.showNotifications(req, res, next))
studentRouter.post("/forget-password-step-1", (req, res, next) => controller.forgotPasswordStep1(req, res, next))
studentRouter.post("/forget-password-step-2", (req, res, next) => controller.forgotPasswordStep2(req, res, next))
studentRouter.post("/forget-password-final", (req, res, next) => controller.forgetPasswordStep3(req, res, next))
studentRouter.post("/buy-student-premium",verifyToken,(req,res,next)=>controller.buyPremium(req,res,next))
//job posting
studentRouter.post("/addJob", verifyToken,(req, res,next) => Jobcontroller.addJob(req, res,next))
studentRouter.get('/student-job-request/:id', (req, res,next) => Jobcontroller.getJobDetails(req, res,next))
//time scheduling
studentRouter.put('/book-tutor-by-post',verifyToken,(req,res,next)=>schedulecontroller.bookThroughPost(req,res,next))
studentRouter.get('/getStudentSchedule/:id', (req, res, next) => schedulecontroller.findStudentSchedule(req, res, next))
studentRouter.get("/student-timeline",verifyToken,(req,res,next)=>schedulecontroller.studentTimeline(req,res,next))
//payment
studentRouter.post('/payment', (req, res,next) => schedulecontroller.payment(req, res,next))
studentRouter.post('/webhook', (req, res, next) => schedulecontroller.webhook(req, res, next))
studentRouter.post('/book-tutor-wallet',verifyToken,(req,res,next)=>schedulecontroller.bookWithWallet(req,res,next))
//chat
studentRouter.post("/conversation", (req, res,next) => controller.newConversation(req, res,next))
studentRouter.get("/get-conversations/:id", (req, res,next) => controller.getConversations(req, res,next))
studentRouter.post("/add-message",ImageUpload.single('image'), (req, res,next) => controller.addMessage(req, res,next))
studentRouter.get("/get-messages/:id", (req, res,next) => controller.getMessages(req, res,next))
studentRouter.get('/getAllUsers/:id', (req, res, next) => controller.getAllUsers(req, res, next))
//homework help controller
studentRouter.post("/add-questions",(verifyToken),ImageUpload.single('image'),(req, res, next) => homeworkHelpController.addQuestions(req, res, next))
studentRouter.get("/get-student-questions", (verifyToken), (req, res, next) => homeworkHelpController.studentQuestions(req, res, next))
// live class
studentRouter.get("/list-live-class",(req,res,next)=>controller.getAllLiveClass(req,res,next))
studentRouter.post("/register-liveclass",(req,res,next)=>controller.registerLiveClass(req,res,next))

export default studentRouter