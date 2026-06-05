import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"

import authRoute from "./auth/auth.route.js"

const app = express()

dotenv.config()

//Middlewares
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}))

app.use("/api/auth",authRoute)

export default app