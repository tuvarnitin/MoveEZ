import { validate } from "../utlis/index.js"
import bookingModel from "./booking.model.js";
import userModel from "../user/user.model.js";

export const createBooking = async (req, res) => {
    try {
        const { driverId, vehicleId, pickUpAddress, dropAddress, pickUpLocation, dropLocation, fare, mobileNumber } = req.body;

        const errors = validate({ driverId, vehicleId, pickUpAddress, dropAddress, pickUpLocation, dropLocation, fare, mobileNumber })
        if (errors.length) {
            return res.status(400).json({
                errors,
                message: "All fields are required",
                success: false
            })
        }

        const driver = await userModel.findById(driverId)
        if (!driver) {
            return res.status(400).json({
                message: "Driver not found",
                success: false
            })
        }

        const alreadyBooked = await bookingModel.findOne({
            user: req.user._id,
            bookingStatus: {
                $in: ["awaiting_payment", "confirmed", "started", "requested"]
            }
        })

        if (alreadyBooked) {
            return res.status(400).json({
                message: "Booking already exists",
                success: true,
                booking: alreadyBooked
            })
        }

        const booking = await bookingModel.create({
            user: req.user._id, driver: driver._id, vehicle: vehicleId, pickUpLocation, dropLocation, pickUpAddress, dropAddress, fare, userMobileNumber: mobileNumber, driverMobileNumber: driver.mobileNumber, bookingStatus: "requested"
        })

        return res.status(201).json({
            message: "Booking created",
            booking,
            success: true
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Booking created error",
            success: false,
            error
        })
    }
}

export const fetchActiveBooking = async (req, res) => {
    try {
        const booking = await bookingModel.findOne({ user: req.user._id, bookingStatus: { $in: ["awaiting_payment", "confirmed", "started", "requested"] } })
        if (!booking) {
            return res.status(400).json({
                message: "Booking not found",
                success: false
            })
        }
        return res.status(200).json({
            message: "Active booking",
            success: true,
            booking
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error (Fetch active booking)",
            success: false,
            error
        })
    }
}

export const cancleBooking = async (req, res) => {
    try {
        const id = req.params.id
        const booking = await bookingModel.findById(id);
        if (!booking || booking.bookingStatus !== "requested") {
            return res.status(400).json({
                message: "Invalid request",
                success: false
            })
        }

        booking.bookingStatus = "cancelled"
        await booking.save()

        return res.status(200).json({
            message: "Booking cancel",
            booking,
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error (Cancel Booking)",
            success: false,
            error
        })
    }
}

export const confirmBooking = async (req, res) => {
    try {
        const { bookingId } = req.body

        const booking = await bookingModel.findById(bookingId)
        if (!booking) {
            return res.status(400).json({
                message: "Booking not found",
                success: false
            })
        }

        booking.paymentStatus = "paid"
        booking.bookingStatus = "confirmed"
        await booking.save()

        return res.status(200).json({
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error (Confirm Booking)",
            error
        })
    }
}

export const fetchAllBookings = async (req, res) => {
    const role = req.user.role
    let bookings
    try {
        if(role === "user"){
            bookings = await bookingModel.find({ user: req.user._id }).populate("user driver vehicle").sort({ createdAt: -1 })
        }else if(role === "partner"){
            bookings = await bookingModel.find({ driver: req.user._id }).populate("user driver vehicle").sort({ createdAt: -1 })
        }
        return res.status(200).json({
            bookings,
            success: true
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Internal server error (Fetch all bookings)",
            error
        })
    }
}