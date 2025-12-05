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