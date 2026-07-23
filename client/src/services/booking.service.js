import apiClient from "../api/API";

export const bookingService = {
    requestBooking: (data) => apiClient.post(`/api/booking`, data),
    fetchAllBookings: (data) => apiClient.get(`/api/booking`, data),
    fetchActiveBooking: (data) => apiClient.get(`/api/booking/active`, data),
    cancelBooking: (data) => apiClient.get(`/api/booking/cancle/${data.id}`, data),
    confirmBooking: (data) => apiClient.post(`/api/booking/confirm/${data.id}`, data),
    sendPickUpOtp: (data) => apiClient.post(`/api/booking/send-p-otp`,data),
    verifyPickUpOtp: (data) => apiClient.post(`/api/booking/verify-p-otp`,data),
    sendDropOtp: (data) => apiClient.post(`/api/booking/send-d-otp`,data),
    verifyDropOtp: (data) => apiClient.post(`/api/booking/verify-d-otp`,data),
}