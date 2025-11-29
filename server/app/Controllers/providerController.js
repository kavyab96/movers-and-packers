/* Controller to handle provider-related actions */
import User from "../Models/userModel.js";
import ServiceRequest from "../Models/serviceRequestModel.js";
import mongoose from "mongoose";



// Get list of available providers based on service type and location and date*/

export const getProviders = async (req, res, next) => {
    try {

       
        
        const { pickup, dropoff, date } = req.query;
        // return res.status(200).json({p:pickup});

        //  Validate input
        // if (!dropoff || !date) {
        //     return res.status(400).json({
        //         message: "location, service_type and date are required.",
        //     });
        // }
        

        // Convert location string → ObjectId
        const pickupId = new mongoose.Types.ObjectId(pickup);
        const dropoffId = new mongoose.Types.ObjectId(dropoff);



        // Convert date into day range
        const reqDate = new Date(date);
        const startOfDay = new Date(reqDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(reqDate.setHours(23, 59, 59, 999));




        //  Find busy providers
        const busyProviders = await ServiceRequest.find({
            requested_date_time: { $gte: startOfDay, $lte: endOfDay },
            status: { $in: ["accepted", "in-progress"] },
            is_active:true
        }).select("provider_id");
        const busyProviderIds = busyProviders.map(b => b.provider_id.toString());


        //  Find providers matching location & service type
        const providers = await User.find({
            role: "provider",
            is_active: true,
            service_areas: { $in: [pickupId,dropoffId] },     // provider covers this location
            _id: { $nin: busyProviderIds }
        })
        .populate({
            path:"service_areas",
            select :"name"
        })
        .select("name email phone service_areas is_active");



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


/* Get assigned jobs for provider */
export const getAssignedJobs = async (req, res, next) => {
    try {
        const providerId = req.user._id;

        // Fetch all jobs assigned to this provider
        const jobs = await ServiceRequest.find({
            provider_id: providerId
        })
            .sort({ requested_date_time: -1 })
            .populate("client_id", "name email phone")
            .populate("provider_id", "name email phone");

        if (!jobs || jobs.length === 0) {
            return res.status(200).json({
                message: "No jobs found for this provider.",
                data: []
            });
        }


        return res.status(200).json({
            message: "Assigned jobs fetched successfully.",
            total: jobs.length,
            data: jobs
        });

    } catch (error) {
        next(error);
    }
}


/* update job status by provider */
export const updateJobStatus = async (req, res, next) => {
    try {

        const providerId = req.user._id;
        const bookingId = req.params.id;
        const { status, tracking_status } = req.body;

        // VALID STATUSES
        const allowedStatuses = ["accepted", "rejected", "in-progress", "completed"];
        const allowedTracking = ["en-route", "arrived", "loading", "moving", "unloading", "completed"];

        // Validate status
        if (!status && !tracking_status) {
            return res.status(400).json({
                message: "Either status or tracking_status is required."
            });
        }

        if (status && !allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: `Invalid status. Allowed: ${allowedStatuses.join(", ")}`
            });
        }

        if (tracking_status && !allowedTracking.includes(tracking_status)) {
            return res.status(400).json({
                message: `Invalid tracking_status. Allowed: ${allowedTracking.join(", ")}`
            });
        }

        // Fetch booking
        const booking = await ServiceRequest.findOne({
            _id: bookingId,
            provider_id: providerId
        });

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found or does not belong to you."
            });
        }

        // Prevent updates on cancelled / completed bookings
        if (["cancelled", "completed"].includes(booking.status)) {
            return res.status(400).json({
                message: `Cannot update because booking is already ${booking.status}.`
            });
        }


        // -----------------------------------
        // APPLY STATUS LOGIC
        // -----------------------------------
        if (status) {
            booking.status = status;
            // If accepted, provider becomes NOT available
            // When provider actually starts working
            if (["accepted", "in-progress"].includes(status)) {
                await User.findByIdAndUpdate(providerId, {
                    availability_status: "on-duty"
                });
            }

            // If job rejected → provider is still "active"
            if (["rejected", "completed"].includes(status)) {
                await User.findByIdAndUpdate(providerId, {
                    availability_status: "active"
                });
            }


            // -------------------------
            // APPLY TRACKING STATUS
            // -------------------------

            if (tracking_status) {
                booking.tracking_status = tracking_status;
            }
            booking.updated_by = providerId;
            await booking.save();
            return res.status(200).json({
                message: "Job status updated successfully.",
                data: booking
            });

        }

    } catch (error) {
        next(error);
    }
}


