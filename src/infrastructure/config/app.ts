import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import studentRouter from '../route/studentRoute'

export const createServer = () => {
    try {
        const app = express()
        app.use(express.json())
        app.use(cors())
        app.use(cookieParser())
        app.use(studentRouter)
        return app
    } catch (error) {
        console.log(error);
    }
}