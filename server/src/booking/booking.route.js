import express from "express"
import { cancleBooking, confirmBooking, createBooking, fetchActiveBooking } from "./booking.controller.js"

const bookingRouter = express.Router()

bookingRouter.post("/",createBooking)
bookingRouter.get("/active",fetchActiveBooking)
bookingRouter.get("/cancle/:id", cancleBooking)
bookingRouter.post("/confirm/:id", confirmBooking)

export default bookingRouter