import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"

import googleRouter from "./passport/google-auth.route.js"
import "./passport/passport.js"

import authRoute from "./auth/auth.route.js"
import { sendOtp } from "./services/mail.service.js"

const app = express()

dotenv.config()

//Middlewares
app.use(express.json())
app.use(cookieParser())


app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = [
            "http://localhost:5173",
            "https://moveezzz.vercel.app"
        ];
        
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));

app.use('/api/auth/google', googleRouter);
app.use("/api/auth",authRoute)

export default app