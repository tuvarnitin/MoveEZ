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

        const { user, token } = await register(name, email, password)

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        })

        const otp = Math.floor(1000 + Math.random() * 9000);

        user.otp = otp;
        await user.save()

        sendOtp(user.name, user.email, otp)

        return res.status(201).json({
            success: true,
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
                emailVerified: user.emailVerified,
                avatar: user.avatar,
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

        if (!user.emailVerified) {
            sendOtp(user.name, user.email)
        }

        const token = await user.generateToken()

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        })

        return res.status(200).json({
            success: true,
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
                emailVerified: user.emailVerified,
                avatar: user.avatar,
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
        sameSite: "strict",
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
            avatar: req.user.avatar
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