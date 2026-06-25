import { Router } from "express";
import User from "../user/user.model.js";
import vehicleModel from "../vehicle/vehicle.model.js";
import { approvePartner, approveVehicle, fetchAdminData, fetchPartnerData, fetchVehicle, rejectPartner, rejectVehicle, startVideoCall, videoKycComplete } from "./admin.controller.js";

const adminRouter = Router()

adminRouter.get("/", fetchAdminData)

adminRouter.get("/reviews/vehicle/:id", fetchVehicle)
adminRouter.get("/reviews/vehicle/approve/:id", approveVehicle)
adminRouter.post("/reviews/vehicle/reject/:id", rejectVehicle)

adminRouter.get("/reviews/partner/:id", fetchPartnerData)
adminRouter.get("/reviews/partner/approve/:id", approvePartner)
adminRouter.post("/reviews/partner/reject/:id", rejectPartner)

adminRouter.get("/video-kyc/start/:id", startVideoCall)
adminRouter.post("/video-kyc/complete", videoKycComplete)

export default adminRouter