import express from "express"
import { registerVehicle } from "./vehicle.controller.js"

const vehicleRouter = express.Router()


vehicleRouter.post("/register",registerVehicle)


export default vehicleRouter