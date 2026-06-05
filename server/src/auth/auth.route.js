import express from "express"
import {registerUser,loginUser, getMe} from "./auth.controller.js"

const authRoute = express.Router()

authRoute.post("/register", registerUser)
authRoute.post('/login', loginUser)
authRoute.get('/me', getMe)

export default authRoute