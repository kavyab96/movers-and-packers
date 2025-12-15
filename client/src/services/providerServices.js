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

//upload KYC documents
export const uploadKycService = (formData) => {
  return axiosInstance.put(`/provider/upload-kyc-documents/`, formData,
    {
      headers: { "Content-Type": "multipart/form-data" }
    },
  )
}

/*get KYC documents */
export const getKycDocumentsService = () => {
  return axiosInstance.get("/provider/get-kyc-documents");
}

/*delete kyc doc by provider*/
export const deleteKycDocumentService = (docId) => {
  return axiosInstance.put(`/provider/delete-kyc-document/${docId}`);
};