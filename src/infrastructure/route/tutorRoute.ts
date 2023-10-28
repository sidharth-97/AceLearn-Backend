
import TutorController from "../../adaptor/tutorController";
import TutorUseCase from "../../useCases/tutorUseCase";
import Encrypt from "../passwordRepository/hashpassword";
import jwtToken from "../passwordRepository/jwt";
import TutorRepository from "../repository/tutorRepository";
import express from "express";
import GenerateOTP from "../utils/GenerateOTP";
import SentMail from "../utils/sendMail";

const repository = new TutorRepository()
const encrypt = new Encrypt()
const jwt = new jwtToken()
const generateOtp = new GenerateOTP()
const sendMail=new SentMail()
const use_case = new TutorUseCase(repository, jwt, encrypt)
const controller=new TutorController(use_case,generateOtp,sendMail)

const tutorRouter = express.Router()

tutorRouter.post("/signup", (req, res) => controller.signup(req, res))
tutorRouter.post("/signupfinal",(req,res)=>controller.signupStep2(req,res))
tutorRouter.post("/login", (req, res) => controller.login(req, res))
tutorRouter.post("/logout", (req, res) => controller.logout(req, res))
tutorRouter.post("/edit-profile",(req,res)=>controller.editProfile)

export default tutorRouter