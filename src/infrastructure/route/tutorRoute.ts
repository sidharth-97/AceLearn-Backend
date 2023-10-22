
import TutorController from "../../adaptor/tutorController";
import TutorUseCase from "../../useCases/tutorUseCase";
import Encrypt from "../passwordRepository/hashpassword";
import jwtToken from "../passwordRepository/jwt";
import TutorRepository from "../repository/tutorRepository";
import express from "express";

const repository = new TutorRepository()
const encrypt = new Encrypt()
const jwt =new jwtToken()
const use_case = new TutorUseCase(repository, jwt, encrypt)
const controller=new TutorController(use_case)

const tutorRouter = express.Router()

tutorRouter.post("/signup", (req, res) => controller.signup(req, res))
tutorRouter.post("/login",(req,res)=>controller.login(req,res))

export default tutorRouter