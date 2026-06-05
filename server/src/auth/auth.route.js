import express from "express"
import {registerUser,loginUser} from "./auth.controller.js"

const authRoute = express.Router()

authRoute.post("/register", registerUser)
authRoute.post('/login', loginUser)

export default authRoute