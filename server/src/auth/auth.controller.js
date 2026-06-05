import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

import User from "../user/user.model.js"
import { register } from "./auth.service.js"

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
            sameSite: "none",
        })

        return res.status(201).json({
            success: true,
            user: {
                name: user.name,
                email: user.email,
                role: user.role
            },
            message: "User registered successfully.",
            token
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

    const isValidPassword = await user.comparePassword(password)

    if (!isValidPassword) {
        return res.status(400).json({
            success: false,
            message: "Invalid email or password."
        })
    }

    const token = await user.generateToken()

    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    })

    return res.status(200).json({
        success: true,
        user: {
            name: user.name,
            email: user.email
        },
        token,
        message: "Login successfully."
    })

}

export const getMe = async (req,res) => {
    const token = req.headers.authorization?.split(" ")[1];

    if(!token){
        return res.status(401).json({
            success:false,
            message:"Token not provided"
        })
    }
    try {
        const {id} = await jwt.verify(token,process.env.JWT_SECRET)
        const user = await User.findById(id)
        
        if(!user){
            return res.status(401).json({
                success: false,
                message: "Invalid Token"
            })
        }
        res.status(200).json({
            success:true
        })
    } catch (error) {
        console.log(error)
    }
} 