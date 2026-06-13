import { Router } from "express"
import { handleUserBank, uploadUserDocs } from "./user.controller.js"

const userRoute = Router()

userRoute.post("/docs/upload", uploadUserDocs)
userRoute.post("/bank/details", handleUserBank)

export default userRoute