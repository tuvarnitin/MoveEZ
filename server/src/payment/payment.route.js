import express from "express"
import { createPayment, verifyPayment } from "./payment.contoller.js"

const paymentRouter = express.Router()

paymentRouter.post("/",createPayment)
paymentRouter.post("/verify",verifyPayment)

export default paymentRouter