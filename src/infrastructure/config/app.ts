import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import studentRouter from '../route/studentRoute'
import tutorRouter from '../route/tutorRoute'
import adminRoute from '../route/adminRoute'

export const createServer = () => {
    try {
        const app = express()
        app.use(express.json())
        app.use(cors({ origin: 'http://localhost:5173' }));
        app.use(cookieParser())
        app.use("/api/students",studentRouter)
        app.use("/api/tutors", tutorRouter)
        app.use("/api/admin", adminRoute)
        return app
    } catch (error) {
        console.log(error);
    }
}