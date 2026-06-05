import apiClient from "../api/API.js";

export const authService = {
    login:(data)=> apiClient.post("/api/auth/login",data),
    register:(data) => apiClient.post("/api/auth/register",data)
}