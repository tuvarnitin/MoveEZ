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
            vehicleModel,
            number: vehicleNumber,
            maxPassengers
        })

        user.onboardingStep = 1;
        await user.save();

        return res.status(201).json({
            success: true,
            message: "Vehicle registered",
            vehicle: newVehicle
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Internal server error (Register Vehicle) : ${error?.message}`
        })
    }
}
