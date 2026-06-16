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
        const vehicle = await Vehicle.findOne({ number: vehicleNumber })

        if (vehicle) {
            return res.status(400).json({
                success: false,
                message: "Vehicle with this number is already registered."
            })
        }

        const newVehicle = await Vehicle.create({
            owner: user._id,
            type: vehicleType,
            model:vehicleModel,
            number: vehicleNumber,
            maxPassengers
        })

        user.onboardingStep = 1;
        await user.save();

        return res.status(201).json({
            success: true,
            message: "Vehicle registered",
            vehicle: newVehicle,
            user
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Internal server error (Register Vehicle) : ${error?.message}`
        })
    }
}

export const fetchVehicle = async (req,res) => {
    const user = req.user
    const vehicle = await Vehicle.findOne({owner:user._id})
    if(vehicle){
        return res.status(200).json({
            vehicle,
            success:true
        })
    }else{
        return res.status(500).json({
            success:false
        })
    }
}
