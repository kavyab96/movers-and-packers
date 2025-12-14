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

//update profile pic
export const profilePicUpdateService = (id , formData) => {
  return axiosInstance.put(`/users/me/profile-pic/${id}`, formData,
    {
      headers: { "Content-Type": "multipart/form-data" }
    },
  )
}

//update profile info
export const updateProfileInfoService =(id,formData)=>{
   return axiosInstance.put(`/users/me/${id}`, formData)
}

//client-----------------------------------------------------
export const getUserBookingsService = (query) => {
  return axiosInstance.get("/client/bookings", {
    params: query
  });
};

//client-----------------------------------------------------
