/* Controller to handle provider-related actions */
import User from "../Models/userModel.js";
import ServiceRequest from "../Models/serviceRequestModel.js";
import mongoose from "mongoose";



// Get list of available providers based on service type and location and date*/

export const getProviders = async (req, res, next) => {
    try {

        const { location, date } = req.query;
        //  Validate input
        if (!location || !date) {
            return res.status(400).json({
                message: "location, service_type and date are required.",
            });
        }

        // Convert location string → ObjectId
        const locationId = new mongoose.Types.ObjectId(location);


       
        // Convert date into day range
        const reqDate = new Date(date);
        const startOfDay = new Date(reqDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(reqDate.setHours(23, 59, 59, 999));




        //  Find busy providers
        const busyProviders = await ServiceRequest.find({
            requested_date_time: { $gte: startOfDay, $lte: endOfDay },
            status: { $in: ["accepted", "in-progress"] }
        }).select("provider_id");
        const busyProviderIds = busyProviders.map(b => b.provider_id.toString());


        //  Find providers matching location & service type
        const providers = await User.find({
            role: "provider",
            is_active: true,
            service_areas: { $in: [locationId] },     // provider covers this location
            _id: { $nin: busyProviderIds }
        }).select("name email phone service_areas");



        console.log("locationId:", locationId);
        console.log("service_areas DB:", providers.map(p => p.service_areas));



        if (providers.length === 0) {
            return res.status(200).json({
                message: "No providers match your location and service type.",
                data: []
            });
        }

        return res.status(200).json({
            message: "Providers fetched successfully",
            total: providers.length,
            data: providers,
        });



    }
    catch (error) {
        next(error);
    }
}



