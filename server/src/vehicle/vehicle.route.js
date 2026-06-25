import express from "express"
import { fetchVehicle, getPricing, registerVehicle, setPricing } from "./vehicle.controller.js"

const vehicleRouter = express.Router()


vehicleRouter.get("/", fetchVehicle)
vehicleRouter.post("/register",registerVehicle)
vehicleRouter.get("/pricing",getPricing)
vehicleRouter.post("/pricing",setPricing)


export default vehicleRouter