import adminController from "../../adaptor/adminController";
import adminUseCase from "../../useCases/adminUsecase";
import Encrypt from "../passwordRepository/hashpassword";
import jwtToken from "../passwordRepository/jwt";
import adminRepository from "../repository/adminRepository";
import express from "express";


const repository =new adminRepository()
const encrypt = new Encrypt()
const jwt=new jwtToken()
const useCases = new adminUseCase(repository, encrypt, jwt)
const controller = new adminController(useCases)

const adminRoute=express.Router()

adminRoute.post("/login", (req, res) => controller.login(req, res))

export default adminRoute