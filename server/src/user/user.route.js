import { Router } from "express"
import { fetchAllBookings, getUserBankDetails, handleUserBank, uploadUserDocs } from "./user.controller.js"

const userRoute = Router()

userRoute.post("/docs/upload", uploadUserDocs)
userRoute.post("/bank/details", handleUserBank)
userRoute.get("/bank/details", getUserBankDetails)
userRoute.get("/bookings", fetchAllBookings)

export default userRoute