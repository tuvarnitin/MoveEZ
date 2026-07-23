import bookingModel from "../booking/booking.model.js"
import razorpay from "../razorpay/razorpay.js"
import crypto from "crypto"
import axios from "axios"
export const createPayment = async (req, res) => {
    try {
        const { bookingId } = req.body;
        const booking = await bookingModel.findById(bookingId)
        if (!booking) {
            return res.status(400).json({
                message: "Booking not found",
                success: false
            })
        }
        const order = await razorpay.orders.create({
            amount: booking.fare * 100,
            currency: "INR",
            receipt: booking._id.toString()
        })

        booking.bookingStatus = "awaiting_payment"
        return res.status(201).json({
            orderId: order.id,
            amount: order.amount,
            success: true,
            message: "Payment created"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Internal server error (Create Payment)",
            error
        })
    }
}

export const verifyPayment = async (req, res) => {
    try {
        const { bookingId, razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

        const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_API_SECRET)
        hmac.update(razorpay_order_id + "|" + razorpay_payment_id)

        const generated_signature = hmac.digest("hex")

        if (generated_signature !== razorpay_signature) {
            return res.status(400).json({
                message: "Invalid signature",
                success: false
            })
        }

        const booking = await bookingModel.findById(bookingId)
        if (!booking) {
            return res.status(400).json({
                message: "Booking not found",
                success: false
            })
        }

        const adminCommission = booking.fare * .1
        const partnerAmount = booking.fare - adminCommission

        booking.adminCommission = adminCommission
        booking.partnerAmount = partnerAmount
        booking.paymentStatus = "paid"
        booking.paymentMethod = "online"
        booking.bookingStatus = "confirmed"
        await booking.save()

        await axios.post(`${process.env.SOCKET_SERVER_URL}/emit`, {
            event: "payment",
            userId: booking.driver,
            data: {
                paymentStatus: "paid",
                paymentMethod: "online",
                bookingStatus : "confirmed"
            }
        })

        return res.status(200).json({
            success: true,
            message: "Payment successfull",
            adminCommission,
            partnerAmount
        })

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error (Verify Payment)",
            success: false,
            error
        })
    }
}