import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
        required: true,
    },
    sender: {
        type: String,
        enum: ["user","driver"],
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const chatModel = mongoose.models.chat || mongoose.model("chat",chatSchema)

export default chatModel