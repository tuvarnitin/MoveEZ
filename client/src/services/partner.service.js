import apiClient from "../api/API";

export const partnerService = {
    requestVideoKyc: (data) => apiClient.get("/api/partner/request/video-kyc",data),
    fetchPendingRequestCount: (data) => apiClient.get("/api/partner/pending-request-count"),
    fetchPendingBookingRequests: (data) => apiClient.get("/api/partner/pending-booking-requests"),
    fetchActiveBooking: (data) => apiClient.get("/api/partner/booking/active"),
    fetchAllBookings: (data) => apiClient.get("/api/partner/bookings"),
    acceptBooking: (data) => apiClient.get(`/api/partner/accept-booking/${data.id}`),
    rejectBooking: (data) => apiClient.get(`/api/partner/reject-booking/${data.id}`),
    getTotalEarning: (data) => apiClient.get(`/api/partner/earning`),
}