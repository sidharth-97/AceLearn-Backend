import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import studentRouter from '../route/studentRoute'
import tutorRouter from '../route/tutorRoute'

export const createServer = () => {
    try {
        const app = express()
        app.use(express.json())
        app.use(cors())
        app.use(cookieParser())
        app.use(studentRouter)
        app.use("/api/tutors",tutorRouter)
        return app
    } catch (error) {
        console.log(error);
    }
}