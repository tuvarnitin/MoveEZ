import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BACKEND_URL

const apiClient = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    },
    timeout: 10000
})

apiClient.interceptors.request.use(
    async (config) => {
        return config
    },
    (error) => { 
        return Promise.reject(error)
    }
)

apiClient.interceptors.response.use(
    (response) => {
        return response.data
    },
    (error) => {
        const message = error.response?.data?.message ||
        error?.message ||
        "Something went wrong"
        return Promise.reject(message)
    }
)

export default apiClient
