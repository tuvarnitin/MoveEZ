import apiClient from "../api/API";

export const bookingService = {
    requestBooking: (data) => apiClient.post(`/api/booking`, data),
    fetchAllBookings: (data) => apiClient.get(`/api/booking`, data),
    fetchActiveBooking: (data) => apiClient.get(`/api/booking/active`, data),
    cancelBooking: (data) => apiClient.get(`/api/booking/cancle/${data.id}`, data),
    confirmBooking: (data) => apiClient.post(`/api/booking/confirm/${data.id}`, data),
}