import chatModel from "./chat.model.js"
const geminiUrl = process.env.GEMINI_API_URL
import axios from "axios"

export const sendMessage = async (req, res) => {
    try {
        const { bookingId, sender, text } = req.body
        const msg = await chatModel.create({
            bookingId, sender, text
        })
        return res.status(201).json({
            msg,
            success: true
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Internal server error (Send Message)",
            error
        })
    }
}

export const getAllMsg = async (req, res) => {
    try {
        const { bookingId } = req.body

        const msgs = await chatModel.find({
            bookingId
        })

        return res.status(200).json({
            msgs,
            success: true
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Internal server error (Get All Message)",
            error
        })
    }
}

export const aiSuggestions = async (req, res) => {
    try {
        const { lastMessage, role, } = req.body
        const prompt = `You are an AI reply suggestion system for a vehicle booking chat app. 
                        Generate short, smart, human-like quick reply suggestions based on:
                        - ROLE (DRIVER or USER)
                        - RECENT_MESSAGE
                        
                        Rules:
                        - Return exactly 3 suggestions
                        - Keep replies short (3-12 words)
                        - Match the conversation context and tone
                        - Driver replies should sound professional and helpful
                        - User replies should sound natural and realistic
                        - Avoid repetition
                        - Return ONLY valid JSON
                        
                        Output format:
                        {
                          "suggestions": [
                            "Reply 1",
                            "Reply 2",
                            "Reply 3",
                            "Reply 4",
                            "Reply 5",
                            "Reply 6"
                          ]
                        }
                        
                        Input:
                        ROLE: ${role}
                        RECENT_MESSAGE: ${lastMessage}`;
        const response = await axios.post(geminiUrl, {
            "contents": [
                {
                    "parts": [
                        {
                            "text": `${prompt}`
                        }
                    ]
                }
            ]
        })

        
        const suggestions = response.data.candidates[0].content.parts;
        
        return res.status(200).json({
            suggestions,
            success: true
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Internal server error (AI Suggestions)",
            error
        })
    }
} 