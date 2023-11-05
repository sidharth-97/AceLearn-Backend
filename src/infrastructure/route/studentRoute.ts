import studentController from "../../adaptor/studentController";
import studentRepository from "../repository/studentRepository";
import StudentUseCase from "../../useCases/studentUseCase";
import Encrypt from "../passwordRepository/hashpassword";
import express from "express";
import jwtToken from "../passwordRepository/jwt";
import GenerateOTP from "../utils/GenerateOTP";
import SentMail from "../utils/sendMail";
import { verifyToken } from "../middlewares/authMiddleware";
import JobRepository from "../repository/jobRepository";
import JobUseCase from "../../useCases/jobUsecase";
import JobController from "../../adaptor/jobController";

const repository = new studentRepository()
const encrypt = new Encrypt()
const jwt = new jwtToken()
const generateOtp=new GenerateOTP()
const use_case = new StudentUseCase(encrypt, repository, jwt)
const sentMail=new SentMail
const controller = new studentController(use_case, generateOtp, sentMail)

const jobRepository = new JobRepository()
const jobUseCase = new JobUseCase(jobRepository)
const Jobcontroller=new JobController(jobUseCase)

const studentRouter = express.Router()

studentRouter.post("/signup", (req, res) => controller.signup(req, res))
studentRouter.post("/signupfinal", (req, res) => controller.signupStep2(req, res))
studentRouter.post("/login", (req, res) => controller.login(req, res))
studentRouter.post("/logout",(req,res)=>controller.logout(req,res))
studentRouter.post("/edit-profile",verifyToken,(req,res)=>controller.editProfile(req,res))
studentRouter.get('/student-details/:id', verifyToken, (req, res) => controller.getStudentInfo(req, res))

studentRouter.post("/addJob", (req, res) => Jobcontroller.addJob(req, res))
studentRouter.get('/student-job-request/:id', (req, res) => Jobcontroller.getJobDetails(req, res))

export default studentRouter