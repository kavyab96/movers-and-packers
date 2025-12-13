import axiosInstance from "../axios/axiosInstance"

export const getAllJobsService = (query) => {
  return axiosInstance.get("/provider/jobs", {
    params: query
  });
};

//update job status
export const updateJobService = (id , formData) => {
  return axiosInstance.put(`/provider/update-job/${id}`, formData)
}

//get provider payments/earnings
export const getPaymentsService = (query) => {
  return axiosInstance.get("/provider/get-payments",{
    params: query
  });
}