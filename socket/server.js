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
app.use(express.json())

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

    socket.on("update-location", async ({ userId, lat, lon }) => {
        await userModel.findByIdAndUpdate(userId,{
            location:{
                type:"Point",
                coordinates:[lon,lat]
            }
        })
    })

    socket.on("disconnect", async () => {
        if (!socket.userId) return
        await userModel.findByIdAndUpdate(socket.userId, { socketId: "", isOnline: false })
    })
})

app.post("/emit",async (req,res)=>{
    try {
        const { event, userId, data } = req.body

        const user = await userModel.findById(userId);
        console.log(user)

        io.to(user.socketId).emit(event, data)

        res.status(200).json({
            success:true
        })

    } catch (error) {
        res.status(500).json({
            success:false
        })
    }
})


httpServer.listen(port, () => {
    console.log(`Server is running on port : http://localhost:${port}`)
})