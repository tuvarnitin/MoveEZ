import apiClient from "../api/API.js";

export const vehicleService = {
    fetchVehicle: (data) => apiClient.get("/api/vehicle"),
    register: (data) => apiClient.post("/api/vehicle/register", data),
    
    // Vehicle pricing APIs
    getPricing: (data) => apiClient.get("/api/vehicle/pricing"),
    setPricing: (data) => apiClient.post("/api/vehicle/pricing",data,{
        headers:{
            "Content-Type":"multipart/form-data"
        }
    }),
    getNearByVehicles: (data) => apiClient.post("/api/vehicle/nearby-vehicles", data),
}