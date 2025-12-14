import axiosInstance from "../axios/axiosInstance"


export const getAllUsersService = (query) => {
  return axiosInstance.get("/admin/getAllUsers", {
    params: query
  });
};



export const getAllBookingsService = (query) => {
  return axiosInstance.get("/admin/getAllBookings", {
    params: query
  });
};


export const getAllAreaService = (query) => {
  return axiosInstance.get("/admin/list-service-areas", {
    params: query
  });
};

//update service area
export const updateAreaService = (id , formData) => {
  return axiosInstance.put(`/admin/edit-service-area/${id}`, formData)
}
//create new area by admin
export const createAreaService = (formData) => {
  return axiosInstance.post(`/admin/add-service-area`, formData)
}

//soft deleting service area
export const deleteAreaService = (id) => {
  return axiosInstance.put(`/admin/delete-service-area/${id}`)
}


