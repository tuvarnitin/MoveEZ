import apiClient from "../api/API";

export const chatServices = {
    sendMessage : (data)=>apiClient.post("/api/chat/send",data),
    getAllMessage : (data)=>apiClient.post("/api/chat",data),
    getAiSuggestions : (data)=>apiClient.post("/api/chat/ai-suggestions",data),
}