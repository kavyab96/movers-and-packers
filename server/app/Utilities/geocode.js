import axios from "axios";

export const getLatLngFromAddress = async (fullAddress) => {
    try {
        const apiKey = process.env.GOOGLE_MAPS_API_KEY;
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(fullAddress)}&key=${apiKey}`;
        const response = await axios.get(url);

        if (!response.data.results || response.data.results.length === 0) {
            return { lat: null, lng: null }; // fallback: cannot geocode
        }

        const location = response.data.results[0].geometry.location;

        return {
            lat: location.lat,
            lng: location.lng,
        };

    } catch (error) {
        return { lat: null, lng: null };
    }

};
