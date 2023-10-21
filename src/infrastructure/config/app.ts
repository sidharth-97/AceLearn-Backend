import express from 'express'
import cors from 'cors'

export const createServer = () => {
    try {
        const app = express()
        app.use(express())
        app.use(cors())
        return app
    } catch (error) {
        console.log(error);
        
    }
}