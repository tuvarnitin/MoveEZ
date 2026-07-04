import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/db.js";
import http from "http"
import { Server } from "socket.io";

import userModel from "./user/user.model.js"

dotenv.config()

const port = process.env.PORT || 5000;

await connectDB();

const app = express()

const httpServer = http.createServer(app)

const io = new Server(httpServer, {
    cors: {
        origin: [process.env.FRONTEND_URL]
    }
})

io.on("connection", (socket) => {
    socket.on("init", async ({ userId }) => {
        socket.userId = userId
        await userModel.findByIdAndUpdate(userId, { socketId: socket.id, isOnline: true })
    })

    socket.on("disconnect",async ()=>{
        if(!socket.userId) return
        await userModel.findByIdAndUpdate(socket.userId, { socketId: "", isOnline: false })
    })
})

httpServer.listen(port, () => {
    console.log(`Server is running on port : ${port}`)
})