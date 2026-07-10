import bookingModel from "../booking/booking.model.js"

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
