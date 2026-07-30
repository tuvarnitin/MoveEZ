import { validate } from "../utlis/index.js"
import bookingModel from "./booking.model.js";
import userModel from "../user/user.model.js";
import axios from "axios"
import { sendStartOtp } from "../services/mail.service.js";

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

        await axios.post(`${process.env.SOCKET_SERVER_URL}/emit`, {
            event: "new-booking",
            userId: driver._id,
            data: booking
        })

        await axios.post(`${process.env.SOCKET_SERVER_URL}/emit`, {
            event: "pending-booking-count",
            userId: driver._id,
            data: 1
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
        const booking = await bookingModel.findOne({ user: req.user._id, bookingStatus: "started" })
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

        await axios.post(`${process.env.SOCKET_SERVER_URL}/emit`, {
            event: "cancel-ride",
            userId: booking.driver,
            data: {
                bookingStatus: "cancelled",
                bookingId:booking._id
            }
        })

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

        booking.paymentStatus = "pending"
        booking.paymentMethod = "cash"
        booking.bookingStatus = "confirmed"
        await booking.save()

        await axios.post(`${process.env.SOCKET_SERVER_URL}/emit`, {
            event: "payment",
            userId: booking.driver,
            data: {
                paymentMethod: "cash",
                paymentStatus: "pending",
                bookingStatus: "confirmed"
            }
        })

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
        if (role === "user") {
            bookings = await bookingModel.find({ user: req.user._id }).populate("user driver vehicle").sort({ createdAt: -1 })
        } else if (role === "partner") {
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

export const sendPickUpOtp = async (req, res) => {
    try {
        const { bookingId } = req.body;
        if (!bookingId) {
            return res.status(400).json({
                message: "Invalid booking id",
                success: false
            })
        }
        const booking = await bookingModel.findById(bookingId).populate("user")

        if (!booking) {
            return res.status(400).json({
                message: "Booking not found",
                success: false
            })
        }
        const otp = Math.floor(1000 + Math.random() * 9000);

        booking.pickUpOtp = otp;
        booking.pickUpOtpExpires = new Date(Date.now() + 5 * 60 * 1000)
        await booking.save()

        if (booking.user.email) {
            await sendStartOtp(booking?.user?.name, booking?.user?.email, otp);
        }

        return res.status(201).json({
            success: true,
            message: "Otp sent"
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error,
            success: false,
            message: "Internal server error (Send PickUp Otp)"
        })
    }
}

export const verifyPickUpOtp = async (req, res) => {
    try {
        const { bookingId, otp } = req.body;

        if (!bookingId) {
            return res.status(400).json({
                message: "Invalid booking id",
                success: false
            })
        }
        const booking = await bookingModel.findById(bookingId).populate("user")

        if (!booking) {
            return res.status(400).json({
                message: "Booking not found",
                success: false
            })
        }
        if (!booking.pickUpOtp) {
            return res.status(400).json({
                message: "Otp not generated",
                success: false
            })
        }

        if (booking.pickUpOtpExpires < new Date()) {
            return res.status(400).json({
                message: "Otp expired",
                success: false
            })
        }

        if (booking.pickUpOtp != otp) {
            return res.status(400).json({
                message: "Incorrect Otp",
                success: false
            })
        }

        booking.pickUpOtp = "";
        booking.bookingStatus = "started";
        booking.pickUpOtpExpires = 0
        await booking.save()

        await axios.post(`${process.env.SOCKET_SERVER_URL}/emit`, {
            event: "ride-started",
            userId: booking.user._id,
            data: {
                bookingStatus: "started"
            }
        })

        return res.status(200).json({
            success: true,
            message: "Otp verified"
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error,
            success: false,
            message: "Internal server error (Verifiy PickUp Otp)"
        })
    }
}

export const sendDropOtp = async (req, res) => {
    try {
        const { bookingId } = req.body;
        if (!bookingId) {
            return res.status(400).json({
                message: "Invalid booking id",
                success: false
            })
        }
        const booking = await bookingModel.findById(bookingId).populate("user")

        if (!booking) {
            return res.status(400).json({
                message: "Booking not found",
                success: false
            })
        }
        const otp = Math.floor(1000 + Math.random() * 9000);

        booking.dropOtp = otp;
        booking.dropOtpExpires = new Date(Date.now() + 5 * 60 * 1000)
        await booking.save()

        if (booking.user.email) {
            await sendStartOtp(booking?.user?.name, booking?.user?.email, otp);
        }

        return res.status(201).json({
            success: true,
            message: "Otp sent"
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error,
            success: false,
            message: "Internal server error (Send Drop Otp)"
        })
    }
}

export const veirfyDropOtp = async (req, res) => {
    try {
        const { bookingId, otp } = req.body;

        if (!bookingId) {
            return res.status(400).json({
                message: "Invalid booking id",
                success: false
            })
        }
        const booking = await bookingModel.findById(bookingId).populate("user")

        if (!booking.dropOtp) {
            return res.status(400).json({
                message: "Otp not generated",
                success: false
            })
        }

        if (booking.dropOtpExpires < new Date()) {
            return res.status(400).json({
                message: "Otp expired",
                success: false
            })
        }

        if (booking.dropOtp != otp) {
            return res.status(400).json({
                message: "Incorrect Otp",
                success: false
            })
        }

        const adminCommission = booking.fare * .1
        const driverAmount = booking.fare - adminCommission

        booking.adminCommission = Math.floor(adminCommission)
        booking.driverAmount = Math.ceil(driverAmount)
        booking.dropOtp = "";
        booking.bookingStatus = "completed";
        booking.paymentStatus = "paid";
        booking.dropOtpExpires = 0
        await booking.save()

        await axios.post(`${process.env.SOCKET_SERVER_URL}/emit`, {
            event: "ride-completed",
            userId: booking.user._id,
            data: {
                bookingStatus: "completed",
                paymentStatus:"paid"
            }
        })

        return res.status(200).json({
            success: true,
            message: "Otp verified"
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error,
            success: false,
            message: "Internal server error (Verifiy Drop Otp)"
        })
    }
}