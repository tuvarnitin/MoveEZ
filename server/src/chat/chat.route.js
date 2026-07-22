import express from "express"
import { aiSuggestions, getAllMsg, sendMessage } from "./chat.controller.js"

const chatRouter = express.Router()

chatRouter.post("/",getAllMsg)
chatRouter.post("/send",sendMessage)
chatRouter.post("/ai-suggestions",aiSuggestions)

export default chatRouter