
import TutorController from "../../adaptor/tutorController";
import TutorUseCase from "../../useCases/tutorUseCase";
import Encrypt from "../passwordRepository/hashpassword";
import jwtToken from "../passwordRepository/jwt";
import TutorRepository from "../repository/tutorRepository";
import express from "express";
import GenerateOTP from "../utils/GenerateOTP";
import SentMail from "../utils/sendMail";
import { protectTutor } from "../middlewares/authMiddleware";
import { ImageUpload } from "../config/multer";
import CloudinaryUpload from "../utils/CloudinaryUpload";
import scheduleController from "../../adaptor/scheduleController";
import ScheduleUsecase from "../../useCases/sheduleUsecase";
import ScheduleRepository from "../repository/scheduleRepository";
import JobRepository from "../repository/jobRepository";
import JobController from "../../adaptor/jobController";
import JobUseCase from "../../useCases/jobUsecase";
import PaymentRepository from "../repository/paymentRepository";

const repository = new TutorRepository()
const encrypt = new Encrypt()
const jwt = new jwtToken()
const generateOtp = new GenerateOTP()
const sendMail = new SentMail()
const Cloudinary=new CloudinaryUpload()
const use_case = new TutorUseCase(repository, jwt, encrypt)



const scheduleRepository = new ScheduleRepository()
const paymentRepository=new PaymentRepository()
const sheduleUsecase=new ScheduleUsecase(scheduleRepository,paymentRepository)
const schedulecontrol = new scheduleController(sheduleUsecase)

const jobRepository = new JobRepository()
const jobUseCase = new JobUseCase(jobRepository)
const Jobcontroller=new JobController(jobUseCase)
const controller = new TutorController(use_case, generateOtp, sendMail, Cloudinary, sheduleUsecase)

const tutorRouter = express.Router()

tutorRouter.post("/signup", (req, res) => controller.signup(req, res))
tutorRouter.post("/signupfinal",(req,res)=>controller.signupStep2(req,res))
tutorRouter.post("/login", (req, res) => controller.login(req, res))
tutorRouter.post("/logout", (req, res) => controller.logout(req, res))
tutorRouter.get("/tutor-details/:id",(req, res) => controller.getTutorInfo(req,res))
tutorRouter.post('/edit-profile', protectTutor, ImageUpload.single('image'), (req, res) => controller.editProfile(req, res))
tutorRouter.put("/tutor-payment",(req,res)=>controller.addTutorPayment(req,res))
//for common
tutorRouter.get("/alltutors", (req, res) => controller.getAllTutors(req, res))
//for schedule
tutorRouter.post('/scheduledate', (req, res) => schedulecontrol.scheduleTime(req, res))
tutorRouter.post('/changeSchedule', (req, res) => schedulecontrol.changeSchedule(req, res))
// tutorRouter.post('/booktutor', (req, res) => schedulecontrol.BookTutor(req, res))
tutorRouter.get('/tutorschedule/:id',(req,res)=>schedulecontrol.TutorSchedule(req,res))
//for job posting
tutorRouter.get('/getallposting', (req, res) => Jobcontroller.getAllJobs(req, res))
tutorRouter.post('/applytutorjob', (req, res) => Jobcontroller.applyJobs(req, res))
//review
tutorRouter.post("/add-review",(req,res)=>controller.addReview(req,res))
tutorRouter.get("/get-review/:id", (req, res) => controller.getTutorReview(req, res))
tutorRouter.get("/old-review/:id",(req,res)=>controller.oldReview(req,res))

export default tutorRouter