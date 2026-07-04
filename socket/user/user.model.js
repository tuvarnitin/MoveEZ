import mongoose from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userShcema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required."],
        minLength: [3, "Name must be of atleast 3 characters."]
    },
    email: {
        type: String,
        required: [true, "Email is required."],
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    password: {
        type: String,
        minLength: [6, "Password must be of 6 characters."],
        select: false
    },
    googleId: {
        type: String,
        default: ""
    },
    avatar: {
        type: String,
        default: "https://res.cloudinary.com/dhm3xypip/image/upload/v1780745361/user-avatar_uiikfj.jpg"
    },
    role: {
        type: String,
        enum: ["user", "partner", "admin"],
        default: "user"
    },
    otp: {
        type: String,
        default: ""
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    authProvider: {
        type: "String",
        default: "local"
    },
    onboardingStep: {
        type: Number,
        default: 0
    },
    partnerStatus: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    },
    rejectionReason: String,
    videoKycStatus: {
        type: String,
        enum: ["pending", "approved", "rejected", "in_progress", "not_required"],
        default: "not_required"
    },
    videoKycRoomId: {
        type: String
    },
    videoKycRejectionReason: {
        type: String
    },
    socketId: {
        type: String
    },
    location: {
        type: {
            type: String,
            enum: ["Point"],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    isOnline: {
        type: Boolean,
        default: false,
        index: true
    }
})

userShcema.index({ location: "2dsphere" })

const userModel = mongoose.model("user", userShcema)

export default userModel
