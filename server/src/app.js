import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"

import googleRouter from "./passport/google-auth.route.js"
import "./passport/passport.js"

import authRoute from "./auth/auth.route.js"
import connectDB from "./config/db.js"
import vehicleRouter from "./vehicle/vehicle.route.js"
import { authMiddleware } from "./auth/auth.middleware.js"
import userRoute from "./user/user.route.js"
import { upload } from "./multer/multer.js"
import multer from "multer"
import adminRouter from "./admin/admin.route.js"
import { adminMiddleware } from "./admin/admin.middleware.js"
import partnerRouter from "./partner/partner.route.js"
import { partnerMiddleware } from "./partner/partner.midlleware.js"
import bookingRouter from "./booking/booking.route.js"

const app = express()

await connectDB()

app.use(cors({
    origin: true,
    credentials: true
}));

dotenv.config()

//Middlewares
app.use(express.json())
app.use(cookieParser())

const FIELDS = [
    { name: "aadhar", maxCount: 1 },
    { name: "license", maxCount: 1 },
    { name: "rc", maxCount: 1 },
]

app.get("/", (req, res) => {
    res.send("Server is running properly")
})

app.use('/api/auth/google', googleRouter);
app.use("/api/auth", authRoute)

app.use("/api/user",authMiddleware,upload.fields(FIELDS),userRoute)
app.use("/api/admin", authMiddleware,adminMiddleware, adminRouter)

app.use("/api/partner", authMiddleware, partnerMiddleware, partnerRouter)
app.use("/api/booking", authMiddleware, bookingRouter)

app.use("/api/vehicle", authMiddleware,upload.single("image"), vehicleRouter)

app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
                success: false,
                message: "File size exceeds 5MB"
            });
        }
    }

    next(err);
});

export default app
