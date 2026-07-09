import { handleUpload } from "../cloudinary/cloudinary.config.js";
import User from "../user/user.model.js";
import Vehicle from "./vehicle.model.js"


export const registerVehicle = async (req, res) => {
    try {
        const user = req.user;
        const { vehicleType, vehicleModel, vehicleNumber, maxPassengers } = req.body;
        const errors = [];

        if (!vehicleType) errors.push({ vehicleType: "Vehicle type is required." });
        if (!vehicleModel) errors.push({ vehicleModel: "Vehicle model is required." });
        if (!vehicleNumber) errors.push({ vehicleNumber: "Vehicle number is required." });
        if (!maxPassengers) errors.push({ maxPassengers: "Passenger capacity is required." });

        if (errors.length) {
            return res.status(400).json({
                success: false,
                errors
            });
        }

        const alreadyExistsVehicle = await Vehicle.findOne({ number: vehicleNumber })

        if (alreadyExistsVehicle && alreadyExistsVehicle.owner.toString() != user._id.toString()) {
            return res.status(400).json({
                success: false,
                message: "Someone already registered this vehicle"
            })
        }

        let vehicle = await Vehicle.findOne({ owner: user._id })

        if (vehicle) {
            vehicle.type = vehicleType
            vehicle.model = vehicleModel
            vehicle.number = vehicleNumber
            vehicle.maxPassengers = maxPassengers
            await vehicle.save()
        } else {
            vehicle = await Vehicle.create({
                owner: user._id,
                type: vehicleType,
                model: vehicleModel,
                number: vehicleNumber,
                maxPassengers
            })

        }
        if (user.partnerStatus == "rejected" && user.onboardingStep >= 3) {
            user.partnerStatus = "pending"
        }
        if (user.onboardingStep == 0) {
            user.onboardingStep = 1
        } else if (user.onboardingStep >= 2) {
            user.onboardingStep = 3
        }

        user.partnerStatus = "pending"
        user.rejectionReason = ""
        await user.save();

        return res.status(201).json({
            success: true,
            message: "Vehicle registered",
            vehicle,
            user
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Internal server error (Register Vehicle) : ${error?.message}`
        })
    }
}

export const fetchVehicle = async (req, res) => {
    const user = req.user
    const vehicle = await Vehicle.findOne({ owner: user._id })
    if (vehicle) {
        return res.status(200).json({
            vehicle,
            success: true
        })
    } else {
        return res.status(500).json({
            success: false
        })
    }
}

export const setPricing = async (req, res) => {
    try {
        const partner = req.user
        const { baseFare, waitingCharge, pricePerKM, imageUrl } = req.body
        const image = req.file
        const errors = {}

        if (!baseFare) {
            errors.baseFare = "Base fare is required"
        }
        if (!waitingCharge) {
            errors.waitingCharge = "Waiting charges are required"
        }
        if (!pricePerKM) {
            errors.pricePerKM = "Price is required"
        }
        if (!image && !imageUrl) {
            errors.image = "Vehicle image is required"
        }

        if (Object.entries(errors).length) {
            return res.status(400).json({
                success: false,
                message: "All fields are required.",
                errors
            })
        }

        const vehicle = await Vehicle.findOne({ owner: partner._id })

        if (!vehicle) {
            return res.status(400).json({
                success: false,
                message: "Vehicle not found"
            })
        }

        let secure_url;

        if (imageUrl !== "undefined") {
            secure_url = imageUrl
        } else {
            const imageObj = await handleUpload(image.buffer, partner._id, "vehicle-image")
            secure_url = imageObj.secure_url
        }
        console

        vehicle.imageUrl = secure_url
        vehicle.baseFare = baseFare
        vehicle.waitingCharge = waitingCharge
        vehicle.pricePerKM = pricePerKM
        vehicle.status = "pending"
        vehicle.rejectionReason = ""
        await vehicle.save()

        partner.onboardingStep = 6
        await partner.save()

        return res.status(200).json({
            success: true,
            message: "Pricing setup successfull"
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Internal server error (Set Pricings)",
            error
        })
    }
}

export const getPricing = async (req, res) => {
    try {
        const partner = req.user
        const vehicle = await Vehicle.findOne({ owner: partner._id })
        if (!vehicle) {
            return res.status(400).json({
                success: false,
            })
        }

        return res.status(200).json({
            success: true,
            vehicle
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Internal server error (Set Pricings)",
            error
        })
    }
}

export const nearByVehicles = async (req, res) => {
    try {
        const { lat, lon, vehicleType } = req.body

        const longitude = Number(lon);
        const latitude = Number(lat);

        const errors = {}

        if (!lat) {
            errors.lat = "Latitude is required"
        }
        if (!lon) {
            errors.lon = "Longitude is required"
        }
        if (!vehicleType) {
            errors.vehicleType = "Vehicle type is required"
        }

        if (Object.entries(errors).length) {
            return res.status(400).json({
                success: false,
                message: "All fields are required.",
                errors
            })
        }

        const partners = await User.find({
            role: "partner",
            partnerStatus: "approved",
            isOnline: true,
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [longitude, latitude],
                    },
                    $maxDistance: 2500
                }
            }
        })

        if(!partners.length){
            return res.status(200).json({   
                success:true,
                vehicles:[],
                message:"No nearby vehicles"
            })
        }

        const partnerIds = partners.map(partner => partner._id)
        console.log(partnerIds)

        const vehicles = await Vehicle.find({
            owner:{
                $in:partnerIds
            },
            type:vehicleType,
            status:"approved",
            isActive : true
        }).lean()

        return res.status(200).json({
            success:true,
            vehicles
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Internal server error (Get Near By Vehicle)",
            error
        })
    }
}