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

adminRoute.post("/login", (req, res,next) => controller.login(req, res,next))
adminRoute.post("/logout", (req, res,next) => controller.logout(req, res,next))
adminRoute.get("/students", (req, res,next) => controller.findStudents(req, res,next))
adminRoute.get("/tutors", (req, res,next) => controller.findTutors(req, res,next))

adminRoute.post("/block-student/:id", (req, res,next) => controller.blockStudent(req, res,next))
adminRoute.post("/block-tutor/:id", (req, res,next) => controller.blockTutor(req, res,next))
adminRoute.post("/add-academic-info", (req, res,next) => controller.addAcademicInfo(req, res,next))
adminRoute.get("/find-academic-details",(req,res,next)=>controller.AcademicInfo(req,res,next))
adminRoute.put("/delete-academic-info",(req,res,next)=>controller.modifyAcademicInfo(req,res,next))

export default adminRoute