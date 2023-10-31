
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


const repository = new TutorRepository()
const encrypt = new Encrypt()
const jwt = new jwtToken()
const generateOtp = new GenerateOTP()
const sendMail = new SentMail()
const Cloudinary=new CloudinaryUpload()
const use_case = new TutorUseCase(repository, jwt, encrypt)
const controller=new TutorController(use_case,generateOtp,sendMail,Cloudinary)

const tutorRouter = express.Router()

tutorRouter.post("/signup", (req, res) => controller.signup(req, res))
tutorRouter.post("/signupfinal",(req,res)=>controller.signupStep2(req,res))
tutorRouter.post("/login", (req, res) => controller.login(req, res))
tutorRouter.post("/logout", (req, res) => controller.logout(req, res))
tutorRouter.get("/tutor-details/:id",(req, res) => controller.getTutorInfo(req,res))
tutorRouter.post('/edit-profile',ImageUpload.single('image'),(req,res)=>controller.editProfile(req,res))

export default tutorRouter