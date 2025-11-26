import axiosInstance from "../axios/axiosInstance"

export const getAreasService = (data) => {
    return axiosInstance.get("/area/all", data)
}


export const searchProviders = (query) => {
  return axiosInstance.get("/provider/get-providers",
    {
    params: query
  });
 
};
