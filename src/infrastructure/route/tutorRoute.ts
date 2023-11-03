
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


const repository = new TutorRepository()
const encrypt = new Encrypt()
const jwt = new jwtToken()
const generateOtp = new GenerateOTP()
const sendMail = new SentMail()
const Cloudinary=new CloudinaryUpload()
const use_case = new TutorUseCase(repository, jwt, encrypt)
const controller = new TutorController(use_case, generateOtp, sendMail, Cloudinary)
const scheduleRepository=new ScheduleRepository()
const sheduleUsecase=new ScheduleUsecase(scheduleRepository)
const schedulecontrol=new scheduleController(sheduleUsecase)

const tutorRouter = express.Router()

tutorRouter.post("/signup", (req, res) => controller.signup(req, res))
tutorRouter.post("/signupfinal",(req,res)=>controller.signupStep2(req,res))
tutorRouter.post("/login", (req, res) => controller.login(req, res))
tutorRouter.post("/logout", (req, res) => controller.logout(req, res))
tutorRouter.get("/tutor-details/:id",(req, res) => controller.getTutorInfo(req,res))
tutorRouter.post('/edit-profile', protectTutor, ImageUpload.single('image'), (req, res) => controller.editProfile(req, res))
//for common
tutorRouter.get("/alltutors", (req, res) => controller.getAllTutors(req, res))
//for schedule
tutorRouter.post('/scheduledate', (req, res) => schedulecontrol.scheduleTime(req, res))
tutorRouter.post('/changeSchedule', (req, res) => schedulecontrol.changeSchedule(req, res))
tutorRouter.post('/booktutor', (req, res) => schedulecontrol.BookTutor(req, res))
tutorRouter.get('/tutorschedule/:id',(req,res)=>schedulecontrol.TutorSchedule(req,res))

export default tutorRouter