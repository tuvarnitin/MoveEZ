import { Router } from "express"
import { uploadUserDocs } from "./user.controller.js"

const userRoute = Router()

userRoute.post("/docs/upload", uploadUserDocs)

export default userRoute