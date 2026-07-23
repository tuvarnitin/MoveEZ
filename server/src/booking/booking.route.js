import express from "express"
import { cancleBooking, confirmBooking, createBooking, fetchActiveBooking, fetchAllBookings, sendDropOtp, sendPickUpOtp, veirfyDropOtp, verifyPickUpOtp } from "./booking.controller.js"

const bookingRouter = express.Router()

bookingRouter.post("/",createBooking)
bookingRouter.get("/",fetchAllBookings)
bookingRouter.get("/active",fetchActiveBooking)
bookingRouter.get("/cancle/:id", cancleBooking)
bookingRouter.post("/confirm/:id", confirmBooking)

bookingRouter.post("/send-p-otp", sendPickUpOtp)
bookingRouter.post("/verify-p-otp", verifyPickUpOtp)
bookingRouter.post("/send-d-otp", sendDropOtp)
bookingRouter.post("/verify-d-otp", veirfyDropOtp)

export default bookingRouter