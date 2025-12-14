
import { format } from "date-fns";

/**   Handles empty string &   Capitalizes first letter*/
export const formatLabel = (str = "") => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};


export const formatDate = (dateString) => {
  if (!dateString) return "-";
  return format(new Date(dateString), "dd MMM yyyy, hh:mm a");
};