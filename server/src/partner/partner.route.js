import { Router } from "express"
import { acceptBooking, fetchPendingBookingRequests, fetchPendingRequestCount, rejectBooking, requestKyc } from "./partner.contoller.js"

const partnerRouter = Router();

partnerRouter.get("/request/video-kyc", requestKyc)
partnerRouter.get("/pending-request-count", fetchPendingRequestCount)
partnerRouter.get("/pending-booking-requests", fetchPendingBookingRequests)
partnerRouter.get("/accept-booking/:id", acceptBooking)
partnerRouter.get("/reject-booking/:id", rejectBooking)

export default partnerRouter