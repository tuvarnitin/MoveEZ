import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"

import googleRouter from "./passport/google-auth.route.js"
import "./passport/passport.js"

import authRoute from "./auth/auth.route.js"
import connectDB from "./config/db.js"
import vehicleRouter from "./vehicle/vehicle.route.js"
import { authMiddleware } from "./auth/auth.middleware.js"

const app = express()

await connectDB()

app.use(cors({
    origin: true,
    credentials: true
}));

dotenv.config()

//Middlewares
app.use(express.json())
app.use(cookieParser())

app.get("/", (req, res) => {
    res.send("Server is running properly")
})

app.use('/api/auth/google', googleRouter);
app.use("/api/auth", authRoute)
app.use("/api/vehicle", authMiddleware, vehicleRouter)

export default app
