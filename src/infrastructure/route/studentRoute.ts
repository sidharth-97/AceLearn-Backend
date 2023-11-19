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

const repository = new studentRepository()
const encrypt = new Encrypt()
const jwt = new jwtToken()
const generateOtp=new GenerateOTP()
const use_case = new StudentUseCase(encrypt, repository, jwt)
const sentMail = new SentMail
const Cloudinary = new CloudinaryUpload()

const chatRepository = new ConversationRepository()
const chatUseCase=new ChatUseCase(chatRepository)

const controller = new studentController(use_case, generateOtp, sentMail,Cloudinary,chatUseCase)

const jobRepository = new JobRepository()
const jobUseCase = new JobUseCase(jobRepository)
const Jobcontroller = new JobController(jobUseCase)

const tutorRepository=new TutorRepository()
const tutorUseCase=new TutorUseCase(tutorRepository,jwt,encrypt)

const scheduleRepository = new ScheduleRepository()
const paymentRepository=new PaymentRepository()
const sheduleUsecase = new ScheduleUsecase(scheduleRepository,paymentRepository)
const schedulecontroller=new scheduleController(sheduleUsecase,use_case,tutorUseCase)

const studentRouter = express.Router()

studentRouter.post("/signup", (req, res) => controller.signup(req, res))
studentRouter.post("/signupfinal", ImageUpload.single('image'),(req, res) => controller.signupStep2(req, res))
studentRouter.post("/login", (req, res) => controller.login(req, res))
studentRouter.post("/logout",(req,res)=>controller.logout(req,res))
studentRouter.post("/edit-profile",verifyToken, ImageUpload.single('image'),(req,res)=>controller.editProfile(req,res))
studentRouter.get('/student-details/:id', verifyToken, (req, res) => controller.getStudentInfo(req, res))
studentRouter.get("/notifications/:id",(req,res)=>controller.showNotifications(req,res))
//job posting
studentRouter.post("/addJob", (req, res) => Jobcontroller.addJob(req, res))
studentRouter.get('/student-job-request/:id', (req, res) => Jobcontroller.getJobDetails(req, res))
//time scheduling
studentRouter.post('/book-tutor-by-post',(req,res)=>schedulecontroller.bookThroughPost(req,res))
studentRouter.get('/getStudentSchedule/:id', (req, res) => schedulecontroller.findStudentSchedule(req, res))
//payment
studentRouter.post('/payment', (req, res) => schedulecontroller.payment(req, res))
studentRouter.post('/webhook',(req,res)=>schedulecontroller.webhook(req,res))
//chat
studentRouter.post("/conversation", (req, res) => controller.newConversation(req, res))
studentRouter.get("/get-conversations/:id",(req,res)=>controller.getConversations(req,res))

export default studentRouter