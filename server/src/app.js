import express from "express"
import cors from "cors"
import dotenv from "dotenv"


const app = express()

dotenv.config()

//Middlewares
app.use(express.json())
app.use(cors({
    origin:"http://localhost:5173",
}))

app.get("/",(req,res)=>{
    res.send("Server is running.")
})

export default app