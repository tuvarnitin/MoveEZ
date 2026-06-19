import apiClient from "../api/API";

export const partnerService = {
    requestVideoKyc: (data) => apiClient.get("/api/partner/request/video-kyc",data)
}