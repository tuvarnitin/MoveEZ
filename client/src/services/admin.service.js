import apiClient from "../api/API";

export const adminService = {
    fetchAdminData:(data) => apiClient.get("/api/admin"),
    fetchPartnerData: (data) => apiClient.get(`/api/admin/reviews/partner/${data.id}`),
    approvePartner: (data) => apiClient.get(`/api/admin/reviews/partner/approve/${data.id}`),
    rejectPartner: (data) => apiClient.post(`/api/admin/reviews/partner/reject/${data.id}`,data),
    startVideoKyc: (data) => apiClient.get(`/api/admin/video-kyc/start/${data.id}`,data),
    videoKycComplete: (data) => apiClient.post(`/api/admin/video-kyc/complete`,data)
}