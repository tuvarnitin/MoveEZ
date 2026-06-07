import express from "express"
import {registerUser,loginUser, getMe, verifyOtp, logout} from "./auth.controller.js"
import { authMiddleware } from "./auth.middleware.js"

const authRoute = express.Router()

authRoute.post("/register", registerUser)
authRoute.post('/login', loginUser)
authRoute.post('/verify-otp' , verifyOtp)
authRoute.get('/me', authMiddleware,getMe)
authRoute.get('/logout', logout)

export default authRoute