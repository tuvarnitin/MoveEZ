import mongoose from "mongoose"

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true
    },
    driver: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true
    },
    vehicle: {
        type: mongoose.Types.ObjectId,
        ref: 'vehicle',
        required: true
    },
    pickUpAddress: {
        type: String
    },
    dropAddress: {
        type: String,
        required: true
    },
    pickUpLocation: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point"
        },
        coordinates: [Number]
    },
    dropLocation: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point"
        },
        coordinates: [Number]
    },
    fare: {
        type: Number,
        required:true,
        default: 0
    },
    userMobileNumber: {
        type:String,
        required:true
    },
    driverMobileNumber: {
        type:String,
        required:true
    },
    bookingStatus: {
        type: String,
        enum: ["idle","requested","awaiting_payment","confirmed","started","completed","cancelled","rejected","expired"],
        default:"idle"
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "cash", "failed"],
        default:"pending"
    },
    adminCommission: {
        type:Number,
        default:0
    },
    driverAmount: {
        type: Number,
        default:0
    },
    pickUpOtp: String,
    pickUpOtpExpires: Date,
    dropOtp: String,
    dropOtpExpires: Date,
    paymentDeadline : Date
}, {
    timestamps: true
})

const bookingModel = mongoose.models.booking || mongoose.model("booking",bookingSchema)

export default bookingModel