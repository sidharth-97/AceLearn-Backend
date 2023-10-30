import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import studentRouter from '../route/studentRoute'
import tutorRouter from '../route/tutorRoute'
import adminRoute from '../route/adminRoute'
import passport from 'passport'

export const createServer = () => {
    try {
        const app = express()
        app.use(express.json())
        // app.use(passport,initialise())
        app.use(cors({ origin: 'http://localhost:5173',credentials:true }));
        app.use(cookieParser())
        app.use("/api/students",studentRouter)
        app.use("/api/tutors", tutorRouter)
        app.use("/api/admin", adminRoute)
        return app
    } catch (error) {
        console.log(error);
    }
}

function initialise(): import("express-serve-static-core").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>> {
    throw new Error('Function not implemented.')
}
