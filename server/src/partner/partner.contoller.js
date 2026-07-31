import bookingModel from "../booking/booking.model.js"
import axios from "axios"

export const requestKyc = async (req, res) => {
    try {
        const partner = req.user

        if (partner.videoKycStatus !== "rejected") {
            return res.status(400).json({
                message: "You can not send kyc request at this time",
                success: false
            })
        }

        partner.videoKycStatus = "pending"
        partner.videoKycRejectionReason = ""
        partner.videoKycRoomId = ""
        await partner.save();

        return res.status(200).json({
            success: true,
            message: "Video kyc request sent",
        })
    } catch (error) {
        return res.status(200).json({
            success: false,
            message: "Internal server error (Request video KYC)",
            error
        })
    }
}

export const fetchPendingRequestCount = async (req, res) => {
    try {
        const user = req.user
        const pendingRequestsCount = await bookingModel.countDocuments({
            driver: user._id,
            bookingStatus: "requested"
        })
        return res.status(200).json({
            success: true,
            pendingRequestsCount
        })
    } catch (error) {
        return res.status(200).json({
            success: false,
            pendingRequestsCount: 0,
            message: "Internal server error (Fetch Pending Request Count)",
            error
        })
    }
}

export const fetchPendingBookingRequests = async (req, res) => {
    try {
        const user = req.user
        const bookings = await bookingModel.find({
            driver: user._id,
            bookingStatus: "requested"
        })
        return res.status(200).json({
            success: true,
            bookings
        })
    } catch (error) {
        return res.status(200).json({
            success: false,
            bookings: 0,
            message: "Internal server error (Fetch Pending Request Count)",
            error
        })
    }
}

export const acceptBooking = async (req, res) => {
    try {
        const id = req.params.id
        const booking = await bookingModel.findById(id);
        if (!booking || booking.bookingStatus !== "requested") {
            return res.status(400).json({
                message: "Invalid request",
                success: false
            })
        }

        booking.bookingStatus = "awaiting_payment"
        booking.paymentDeadline = new Date(Date.now() + 5 * 60 * 1000)
        await booking.save()

        await axios.post(`${process.env.SOCKET_SERVER_URL}/emit`, {
            event: "accept-booking",
            userId: booking.user,
            data: booking.bookingStatus
        })

        return res.status(200).json({
            message: "Booking accepted",
            booking,
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error (Accept Booking)",
            success: false,
            error
        })
    }
}

export const rejectBooking = async (req, res) => {
    try {
        const id = req.params.id
        const booking = await bookingModel.findById(id);
        if (!booking || booking.bookingStatus !== "requested") {
            return res.status(400).json({
                message: "Invalid request",
                success: false
            })
        }

        booking.bookingStatus = "rejected"
        await booking.save()

        await axios.post(`${process.env.SOCKET_SERVER_URL}/emit`, {
            event: "reject-booking",
            userId: booking.user,
            data: "rejected"
        })

        return res.status(200).json({
            message: "Booking rejected",
            booking,
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error (Reject Booking)",
            success: false,
            error
        })
    }
}

export const fetchActiveBookings = async (req, res) => {
    try {
        const user = req.user
        const booking = await bookingModel.findOne({
            driver: user._id,
            bookingStatus: {
                $in: ["confirmed", "started"]
            }
        }).populate("user vehicle driver")
        if (!booking) {
            return res.status(400).json({
                success: false,
                message: "No active booking"
            })
        }
        return res.status(200).json({
            success: true,
            booking
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            booking: [],
            message: "Internal server error (Fetch Acitve Booking)",
            error
        })
    }
}

export const getTotalEarning = async (req, res) => {
    try {
        const user = req.user
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

        const bookings = await bookingModel.find({
            paymentStatus: "paid",
            createdAt: {
                $gte: sevenDaysAgo
            },
            driver:user._id
        }).select("driverAmount createdAt")

        const earningMap = {}
        let earning = []

        bookings.forEach(booking => {
            const date = new Date(booking.createdAt).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short"
            })

            if (!earningMap[date]) {
                earningMap[date] = 0
            }
            earningMap[date] += booking.driverAmount || 0

            earning = Object.entries(earningMap).map(([date, earnings]) => ({ date,earnings }))

        })
        return res.status(200).json({
            earning
        })
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            message: "internal server error (Partner earnings)",
            error
        })
    }
}