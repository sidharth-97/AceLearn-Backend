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

const repository = new studentRepository()
const encrypt = new Encrypt()
const jwt = new jwtToken()
const generateOtp=new GenerateOTP()
const use_case = new StudentUseCase(encrypt, repository, jwt)
const sentMail = new SentMail
const Cloudinary = new CloudinaryUpload()

const conversationRepository = new ConversationRepository()
const messageRepository=new MessageRepository()
const chatUseCase = new ChatUseCase(conversationRepository, messageRepository)

const tutorRepository=new TutorRepository()
const tutorUseCase = new TutorUseCase(tutorRepository, jwt, encrypt)

const controller = new studentController(use_case, generateOtp, sentMail,Cloudinary,chatUseCase,tutorUseCase)

const jobRepository = new JobRepository()
const jobUseCase = new JobUseCase(jobRepository)
const Jobcontroller = new JobController(jobUseCase)



const scheduleRepository = new ScheduleRepository()
const paymentRepository=new PaymentRepository()
const sheduleUsecase = new ScheduleUsecase(scheduleRepository,paymentRepository,tutorRepository,repository)
const schedulecontroller=new scheduleController(sheduleUsecase,use_case,tutorUseCase)

const studentRouter = express.Router()

studentRouter.post("/signup", (req, res,next) => controller.signup(req, res,next))
studentRouter.post("/signupfinal", ImageUpload.single('image'),(req, res,next) => controller.signupStep2(req, res,next))
studentRouter.post("/login", (req, res,next) => controller.login(req, res,next))
studentRouter.post("/logout",(req,res,next)=>controller.logout(req,res,next))
studentRouter.put("/edit-profile",verifyToken, ImageUpload.single('image'),(req,res,next)=>controller.editProfile(req,res,next))
studentRouter.get('/student-details/:id', verifyToken, (req, res,next) => controller.getStudentInfo(req, res,next))
studentRouter.get("/notifications/:id",(req,res,next)=>controller.showNotifications(req,res,next))
//job posting
studentRouter.post("/addJob", (req, res,next) => Jobcontroller.addJob(req, res,next))
studentRouter.get('/student-job-request/:id', (req, res,next) => Jobcontroller.getJobDetails(req, res,next))
//time scheduling
studentRouter.put('/book-tutor-by-post',(req,res,next)=>schedulecontroller.bookThroughPost(req,res,next))
studentRouter.get('/getStudentSchedule/:id', (req, res,next) => schedulecontroller.findStudentSchedule(req, res,next))
//payment
studentRouter.post('/payment', (req, res,next) => schedulecontroller.payment(req, res,next))
studentRouter.post('/webhook', (req, res, next) => schedulecontroller.webhook(req, res, next))
studentRouter.post('/book-tutor-wallet',(req,res,next)=>schedulecontroller.bookWithWallet(req,res,next))
//chat
studentRouter.post("/conversation", (req, res,next) => controller.newConversation(req, res,next))
studentRouter.get("/get-conversations/:id", (req, res,next) => controller.getConversations(req, res,next))
studentRouter.post("/add-message", (req, res,next) => controller.addMessage(req, res,next))
studentRouter.get("/get-messages/:id", (req, res,next) => controller.getMessages(req, res,next))
studentRouter.get('/getAllUsers/:id',(req,res,next)=>controller.getAllUsers(req,res,next))

export default studentRouter