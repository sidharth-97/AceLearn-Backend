import studentController from "../../adaptor/studentController";
import studentRepository from "../repository/studentRepository";
import StudentUseCase from "../../useCases/studentUseCase";
import Encrypt from "../passwordRepository/hashpassword";
import express from "express";
import jwtToken from "../passwordRepository/jwt";

const repository = new studentRepository()
const encrypt = new Encrypt()
const jwt=new jwtToken()
const use_case = new StudentUseCase(encrypt, repository,jwt)
const controller = new studentController(use_case)

const studentRouter = express.Router()

studentRouter.post("/api/student/signup", (req, res) => controller.signup(req, res))
studentRouter.post("/api/student/login",(req,res)=>controller.login(req,res))

export default studentRouter