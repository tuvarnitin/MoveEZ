import apiClient from "../api/API.js";

export const authService = {
    login:(data)=> apiClient.post("/api/auth/login",data),
    register:(data) => apiClient.post("/api/auth/register",data),
    getMe:() => apiClient.get("/api/auth/me",{}),
    logout:() => apiClient.get("/api/auth/logout",{}),
    verifyOtp:(data={}) => apiClient.post("/api/auth/verify-otp",data)
}