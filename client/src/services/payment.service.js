import apiClient from "../api/API";

export const paymentService = {
    createPayment: (data) => apiClient.post("/api/payment",(data)),
    verifyPayment: (data) => apiClient.post("/api/payment/verify",(data)),
}