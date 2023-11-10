import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import studentRouter from '../route/studentRoute'
import tutorRouter from '../route/tutorRoute'
import adminRoute from '../route/adminRoute'
import passport from 'passport'
import bodyParser from 'body-parser';
import session from 'express-session'
import http from 'http'
import initializeSocket from './socketServer'


export const createServer = () => {
    try {
        const app = express()
        app.use(express.json())
        app.use(bodyParser.raw({ type: 'application/json' }));
        app.use(
            session({
              secret: 'your-secret-key', // Change this to a secure random string
              resave: false,
              saveUninitialized: true
            })
          );
        // app.use(passport,initialise())
        app.use(cors({ origin: 'http://localhost:5173',credentials:true }));
        app.use(cookieParser())
        app.use("/api/students",studentRouter)
        app.use("/api/tutors", tutorRouter)
      app.use("/api/admin", adminRoute)
      const server = http.createServer(app)
      initializeSocket(server)
        return server
    } catch (error) {
        console.log(error);
    }
}
