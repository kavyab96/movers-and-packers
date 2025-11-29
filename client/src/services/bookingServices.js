

import axiosInstance from "../axios/axiosInstance"



export const createBookingService = (formData) => {
    return axiosInstance.post("/client/create-booking", formData,        
    )
}