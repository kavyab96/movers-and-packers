import axios from "axios";

export const getDistanceInKm = async (origin, destination) => {
  try {
    const apiKey = process.env.ORS_API_KEY;

    const url = "https://api.openrouteservice.org/v2/directions/driving-car";

    const payload = {
      coordinates: [
        [origin.lng, origin.lat],         // ORS uses [lng, lat]
        [destination.lng, destination.lat]
      ],
    };

    const response = await axios.post(url, payload, {
      headers: {
        Authorization: apiKey,
        "Content-Type": "application/json",
      },
    });

    const meters = response.data.routes[0].summary.distance; // in meters
    const km = meters / 1000;

    return km.toFixed(2);

  } catch (error) {
    console.error("ORS Distance Error:", error.response?.data || error.message);
    return null;
  }
};
