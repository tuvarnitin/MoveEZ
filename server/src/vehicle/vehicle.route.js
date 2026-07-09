import express from "express"
import { fetchVehicle, nearByVehicles, getPricing, registerVehicle, setPricing } from "./vehicle.controller.js"

const vehicleRouter = express.Router()


vehicleRouter.get("/", fetchVehicle)
vehicleRouter.post("/register",registerVehicle)
vehicleRouter.get("/pricing",getPricing)
vehicleRouter.post("/pricing",setPricing)
vehicleRouter.post("/nearby-vehicles",nearByVehicles)

export default vehicleRouter