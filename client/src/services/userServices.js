import axiosInstance from "../axios/axiosInstance"

export const getAreasService = (data) => {
    return axiosInstance.get("/area/all", data)
}



