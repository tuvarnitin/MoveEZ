import { Router } from "express"
import { acceptBooking, fetchActiveBookings, fetchPendingBookingRequests, fetchPendingRequestCount, getTotalEarning, rejectBooking, requestKyc } from "./partner.contoller.js"

const partnerRouter = Router();

partnerRouter.get("/request/video-kyc", requestKyc)
partnerRouter.get("/pending-request-count", fetchPendingRequestCount)
partnerRouter.get("/pending-booking-requests", fetchPendingBookingRequests)
partnerRouter.get("/booking/active", fetchActiveBookings)
partnerRouter.get("/accept-booking/:id", acceptBooking)
partnerRouter.get("/reject-booking/:id", rejectBooking)
partnerRouter.get("/earning",getTotalEarning)

export default partnerRouter