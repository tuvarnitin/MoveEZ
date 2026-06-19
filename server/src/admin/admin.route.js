import { Router } from "express";
import User from "../user/user.model.js";
import vehicleModel from "../vehicle/vehicle.model.js";
import { approvePartner, fetchAdminData, fetchPartnerData, rejectPartner, startVideoCall, videoKycComplete } from "./admin.controller.js";

const adminRouter = Router()

adminRouter.get("/", fetchAdminData)
adminRouter.get("/reviews/partner/:id", fetchPartnerData)
adminRouter.get("/reviews/partner/approve/:id", approvePartner)
adminRouter.post("/reviews/partner/reject/:id", rejectPartner)
adminRouter.get("/video-kyc/start/:id", startVideoCall)
adminRouter.post("/video-kyc/complete", videoKycComplete)

export default adminRouter