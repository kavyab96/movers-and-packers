import axiosInstance from "../axios/axiosInstance";

// Admin dashboard stats
export const getAdminDashboardStats = () => {
  return axiosInstance.get("/admin/dashboard-stats");
};

// Provider dashboard stats
export const getProviderDashboardStats = () => {
  return axiosInstance.get("/provider/dashboard-stats");
};

// User dashboard stats
export const getUserDashboardStats = () => {
  return axiosInstance.get("/client/dashboard-stats");
};