import apiClient from "../api/API.js";

export const vehicleService = {
    register: (data) => apiClient.post("/api/vehicle/register", data),
    fetchVehicle: (data) => apiClient.get("/api/vehicle")
}