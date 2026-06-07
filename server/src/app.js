import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"

import googleRouter from "./passport/google-auth.route.js"
import "./passport/passport.js"

import authRoute from "./auth/auth.route.js"
import { sendOtp } from "./services/mail.service.js"

const app = express()
app.use(cors({
    origin: ["https://moveezzz.vercel.app", "http://localhost:5173"],
    credentials: true
}));

dotenv.config()

//Middlewares
app.use(express.json())
app.use(cookieParser())

app.use('/api/auth/google', googleRouter);
app.use("/api/auth",authRoute)

export default app