import { Router } from "express"
import { requestKyc } from "./partner.contoller.js"

const partnerRouter = Router();

partnerRouter.get("/request/video-kyc", requestKyc)

export default partnerRouter