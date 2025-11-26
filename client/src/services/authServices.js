import axiosInstance from "../axios/axiosInstance"

export const loginService = (data) => {
    return axiosInstance.post("/auth/login", data)
}

export const regService = (formData) => {
    return axiosInstance.post("/auth/register", formData,        
        {
            headers: { "Content-Type": "multipart/form-data" }       
        },
    )
}

