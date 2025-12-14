import axiosInstance from "../axios/axiosInstance"


export const createPaymentSession = (data) => {
    return axiosInstance.post("/payment/create-stripe-session", data)
}

export const verifyPayment = (data) => {
       return axiosInstance.post("/payment/verify-payment", data)
}