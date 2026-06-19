import Vehicle from "./vehicle.model.js"

export const registerVehicle = async (req, res) => {
    try {
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

        const user = req.user;
        let vehicle = await Vehicle.findOne({ owner:user._id })

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
