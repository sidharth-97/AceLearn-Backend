import adminController from "../../adaptor/adminController";
import adminUseCase from "../../useCases/adminUsecase";
import Encrypt from "../passwordRepository/hashpassword";
import jwtToken from "../passwordRepository/jwt";
import adminRepository from "../repository/adminRepository";
import express from "express";
import studentRepository from "../repository/studentRepository";
import TutorRepository from "../repository/tutorRepository";


const repository =new adminRepository()
const encrypt = new Encrypt()
const jwt = new jwtToken()
const studentRepo = new studentRepository()
const tutorRepo=new TutorRepository()
const useCases = new adminUseCase(repository, encrypt, jwt,studentRepo,tutorRepo)
const controller = new adminController(useCases)

const adminRoute=express.Router()

adminRoute.post("/login", (req, res) => controller.login(req, res))
adminRoute.post("/logout", (req, res) => controller.logout(req, res))
adminRoute.get("/students", (req, res) => controller.findStudents(req, res))
adminRoute.get("/tutors", (req, res) => controller.findTutors(req, res))

adminRoute.post("/block-student/:id", (req, res) => controller.blockStudent(req, res))
adminRoute.post("/block-tutor/:id", (req, res) => controller.blockTutor(req, res))
adminRoute.post("/add-subject",(req,res)=>controller.addSubject(req,res))


export default adminRoute