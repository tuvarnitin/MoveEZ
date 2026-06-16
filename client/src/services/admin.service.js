import apiClient from "../api/API";

export const adminService = {
    fetchAdminData:(data) => apiClient.get("/api/admin")
}