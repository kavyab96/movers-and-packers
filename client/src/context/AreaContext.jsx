import { createContext, useContext, useEffect, useState } from "react";
import { getAreasService } from "../services/userServices";

const AreaContext = createContext();

export const AreaProvider = ({ children }) => {
  const [areas, setAreas] = useState([]);
  const [loadingAreas, setLoadingAreas] = useState(true);

  // Load once when app starts
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const res = await getAreasService();
        setAreas(res.data.data); // data from backend
      } catch (error) {
        console.log("Error fetching areas:", error);
      } finally {
        setLoadingAreas(false);
      }
    };

    fetchAreas();
  }, []); // RUNS ONLY ONCE

  return (
    <AreaContext.Provider value={{ areas, loadingAreas }}>
      {children}
    </AreaContext.Provider>
  );
};

export const useAreas = () => useContext(AreaContext);
