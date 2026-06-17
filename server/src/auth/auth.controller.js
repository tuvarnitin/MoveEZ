import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

import User from "../user/user.model.js"
import { register } from "./auth.service.js"
import { sendOtp } from "../services/mail.service.js"

export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body

        if (!email || !name || !password) {
            return res.status(400).json({
                success: false,
                message: "email, password and name are required."
            })
        }

        const isUserAlreadyExists = await User.findOne({ email })

        if (isUserAlreadyExists) {
            return res.status(401).json({
                success: false,
                message: "User already exists with email."
            })
        }

        const { user } = await register(name, email, password)

        const accessToken = await jwt.sign({ id: user._id, name: user.name, email: user.email }, process.env.JWT_SECRET, { expiresIn: "15m" })
        const refreshToken = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })

        res.cookie("token", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 15 * 60 * 1000 
        })
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        const otp = Math.floor(1000 + Math.random() * 9000);

        user.otp = otp;
        await user.save()

        await sendOtp(user.name, user.email, otp);

        return res.status(201).json({
            success: true,
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
                emailVerified: user.emailVerified,
                avatar: user.avatar,
                partnerStatus: user.partnerStatus,
                rejectionReason: user.rejectionReason
            },
            message: "Registered successfully."
        })

    } catch (error) {
        if (error.message && error.message.startsWith("user validation failed:")) {

            const message = error.message.split("user validation failed:")[1].trim().split(",").map(s => s.trim())
            return res.status(400).json({
                success: false,
                message
            })
        }
        return res.status(500).json({
            success: false,
            message: `Internal server error : ${error.message}`
        })
    }
}

export const loginUser = async (req, res) => {

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "email and password are required."
            })
        }

        const user = await User.findOne({ email }).select("+password")

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            })
        }

        let isValidPassword;
        if (user.authProvider === "local") {
            isValidPassword = await user.comparePassword(password)
        } else {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            })
        }


        if (!isValidPassword) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password."
            })
        }

        const accessToken = await jwt.sign({ id: user._id, name: user.name, email: user.email }, process.env.JWT_SECRET, { expiresIn: "15m" })
        const refreshToken = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })

        res.cookie("token", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 15 * 60 * 1000
        })
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000 
        })

        return res.status(200).json({
            success: true,
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
                emailVerified: user.emailVerified,
                avatar: user.avatar,
                partnerStatus: user.partnerStatus,
                rejectionReason: user.rejectionReason
            },
            message: "Login successfully."
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        })
    }

}

export const logout = async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    })
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    })

    return res.status(200).json({
        success: true
    })
}

export const getMe = async (req, res) => {
    return res.json({
        success: true,
        user: {
            name: req.user.name,
            email: req.user.email,
            role: req.user.role,
            emailVerified: req.user.emailVerified,
            avatar: req.user.avatar,
            onboardingStep: req.user.onboardingStep,
            partnerStatus: req.user.partnerStatus,
            rejectionReason: req.user.rejectionReason
        }
    })
}

export const verifyOtp = async (req, res) => {
    try {
        const { otp } = req.body
        const token = req.headers.authorization?.split(" ")[1] || req.cookies.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token not provided"
            })
        }

        const { id } = await jwt.verify(token, process.env.JWT_SECRET)

        const user = await User.findById(id)

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorize"
            })
        }

        if (!otp) {
            return res.status(400).json({
                success: false,
                message: "Please provide otp"
            })
        }

        if (otp === user.otp) {

            user.otp = ""
            user.emailVerified = true
            await user.save()

            return res.status(200).json({
                success: true,
                message: "OTP verified successfully",
                user: {
                    email: user.email,
                    name: user.name,
                    emailVerified: user.emailVerified,
                    role: user.role,
                    token
                }
            })

        }
        return res.status(400).json({
            success: false,
            message: "Wrong otp"
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        })
    }
}

export const refreshToken = async (req, res) => {
    try {
        const refresh = req.cookies.refreshToken
        if (!refresh) {
            return res.status(401).json({ success: false, message: "Refresh token not provided" })
        }

        const payload = await jwt.verify(refresh, process.env.JWT_SECRET)
        const user = await User.findById(payload.id)
        if (!user) {
            return res.status(401).json({ success: false, message: "Unauthorize" })
        }

        // issue new access token
        const accessToken = await jwt.sign({ id: user._id, name: user.name, email: user.email }, process.env.JWT_SECRET, { expiresIn: "15m" })

        res.cookie("token", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 15 * 60 * 1000
        })

        return res.status(200).json({ success: true })
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid refresh token" })
    }
}