import express from "express"
import { fetchVehicle, registerVehicle } from "./vehicle.controller.js"

const vehicleRouter = express.Router()


vehicleRouter.get("/", fetchVehicle)
vehicleRouter.post("/register",registerVehicle)


export default vehicleRouter