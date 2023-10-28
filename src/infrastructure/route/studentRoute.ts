import studentController from "../../adaptor/studentController";
import studentRepository from "../repository/studentRepository";
import StudentUseCase from "../../useCases/studentUseCase";
import Encrypt from "../passwordRepository/hashpassword";
import express from "express";
import jwtToken from "../passwordRepository/jwt";
import GenerateOTP from "../utils/GenerateOTP";
import SentMail from "../utils/sendMail";

const repository = new studentRepository()
const encrypt = new Encrypt()
const jwt = new jwtToken()
const generateOtp=new GenerateOTP()
const use_case = new StudentUseCase(encrypt, repository, jwt)
const sentMail=new SentMail
const controller = new studentController(use_case,generateOtp,sentMail)

const studentRouter = express.Router()

studentRouter.post("/signup", (req, res) => controller.signup(req, res))
studentRouter.post("/signupfinal", (req, res) => controller.signupStep2(req, res))
studentRouter.post("/login", (req, res) => controller.login(req, res))
studentRouter.post("/logout",(req,res)=>controller.logout(req,res))
studentRouter.post("/edit-profile",(req,res)=>controller.editProfile(req,res))

export default studentRouter