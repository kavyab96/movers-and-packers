

import axiosInstance from "../axios/axiosInstance"



export const createBookingService = (formData) => {
    return axiosInstance.post("/client/create-booking", formData,        
    )
}

//calculate distance_km and estimated cost
export const calculateCostService = (formData) => {
  return axiosInstance.post("/client/calculate-cost", formData);
};