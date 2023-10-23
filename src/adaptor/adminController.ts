import { Request, Response } from "express";
import adminUseCase from "../useCases/adminUsecase";


class adminController{
    private use_case: adminUseCase
    constructor(use_case: adminUseCase) {
        this.use_case=use_case
    }
    async login(req: Request, res: Response) {
        try {
            const admin = await this.use_case.login(req.body)
            res.cookie('jwt', admin.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== 'development',
                sameSite: 'strict',
                maxAge: 30 * 24 * 60 * 60 * 1000,
              });
            res.status(admin.status).json(admin.data)
        } catch (error) {
            res.status(401).json(error)
        }
    }
}

export default adminController