import apiClient from "../api/API";

export const userService = {
    uploadDocs:(data) => apiClient.post("/api/user/docs/upload",data,{
        headers:{
            "Content-Type":"multipart/form-data"
        }
    })
}