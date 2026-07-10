import express from "express"
import { cancleBooking, createBooking, fetchActiveBooking } from "./booking.controller.js"

const bookingRouter = express.Router()

bookingRouter.post("/",createBooking)
bookingRouter.get("/active",fetchActiveBooking)
bookingRouter.get("/cancle/:id", cancleBooking)

export default bookingRouter