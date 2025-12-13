/* Controller to handle provider-related actions */
import User from "../Models/userModel.js";
import ServiceRequest from "../Models/serviceRequestModel.js";
import Payment from "../Models/paymentModel.js";
import mongoose from "mongoose";



// Get list of available providers based on service type and location and date*/

export const getProviders = async (req, res, next) => {
    try {

        const { pickup, dropoff, date, page = 1, limit = 5 } = req.query;

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        // const { pickup, dropoff, date } = req.query;
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
            is_active: true
        }).select("provider_id");
        const busyProviderIds = busyProviders.map(b => b.provider_id.toString());


        // TOTAL COUNT (without skip/limit)
        const total = await User.countDocuments({
            role: "provider",
            is_active: true,
            service_areas: { $in: [pickupId, dropoffId] },
            _id: { $nin: busyProviderIds },
        });


        //  Find providers matching location & service type
        const providers = await User.find({
            role: "provider",
            is_active: true,
            service_areas: { $in: [pickupId, dropoffId] },     // provider covers this location
            _id: { $nin: busyProviderIds }
        })
            .populate({
                path: "service_areas",
                select: "name"
            })
            .select("name email phone service_areas is_active")
            .skip(skip)
            .limit(limitNum);



        if (providers.length === 0) {
            return res.status(200).json({
                message: "No providers match your location and service type.",
                data: []
            });
        }
        // return res.status(200).json({
        //     message: "Providers fetched successfully",
        //     total: providers.length,
        //     data: providers,
        // });

        return res.status(200).json({
            message: "Providers fetched successfully",
            total,
            currentPage: pageNum,
            totalPages: Math.ceil(total / limitNum),
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
        const { page = 1, limit = 5 } = req.query;


        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        const providerId = req.user._id;

        // Fetch all jobs assigned to this provider
        const jobs = await ServiceRequest.find({
            provider_id: providerId,
            is_active: true
        })
            .populate("client_id", "name email phone")
            .populate("provider_id", "name email phone")
            .populate("pickup_location", "name")
            .populate("dropoff_location", "name")
            .populate("payment","payment_status amount ") 
            .sort({ requested_date_time: -1 })
            .skip(skip)
            .limit(limitNum);

        if (!jobs || jobs.length === 0) {
            return res.status(200).json({
                message: "No jobs found for this provider.",
                data: []
            });
        }

        // TOTAL COUNT (without skip/limit)
        const total = await ServiceRequest.countDocuments({
            provider_id: providerId,
            is_active: true,
        });



        return res.status(200).json({
            message: "Assigned jobs fetched successfully.",
            total,
            currentPage: pageNum,
            totalPages: Math.ceil(total / limitNum),
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
        // return res.status(200).json({
        //         params: req.params,
        //         body:req.body,
        //         message:"from server"
        //     });

        // VALID STATUSES
        const allowedStatuses = ["accepted", "cancelled", "in-progress", "completed", "pending"];
        const allowedTracking = ["en-route", "arrived", "loading", "moving", "unloading", "completed"];

        // Validate status
        if (!status && !tracking_status) {
            return res.status(400).json({
                error: "Either status or tracking_status is required."
            });
        }

        if (status && !allowedStatuses.includes(status)) {
            return res.status(400).json({
                error: `Invalid status. Allowed: ${allowedStatuses.join(", ")}`
            });
        }

        if (tracking_status && !allowedTracking.includes(tracking_status)) {
            return res.status(400).json({
                error: `Invalid tracking_status. Allowed: ${allowedTracking.join(", ")}`
            });
        }

        // Fetch booking
        const booking = await ServiceRequest.findOne({
            _id: bookingId,
            provider_id: providerId
        });

        if (!booking) {
            return res.status(404).json({
                error: "Booking not found or does not belong to you."
            });
        }

        // Prevent updates on cancelled / completed bookings
        if (["cancelled", "completed"].includes(booking.status)) {
            return res.status(400).json({
                error: `Cannot update because booking is already ${booking.status}.`
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
            if (["cancelled", "completed"].includes(status)) {
                await User.findByIdAndUpdate(providerId, {
                    availability_status: "active"
                });
            }


            // -------------------------
            // APPLY TRACKING STATUS
            // -------------------------

            // if (tracking_status) {
            //     booking.tracking_status = tracking_status;
            // }

            if (tracking_status === "") {
                booking.tracking_status = null;  // clear the field
            } else if (tracking_status) {
                booking.tracking_status = tracking_status;
            }

            booking.updated_by = providerId;
            await booking.save();

            // If completed, create payment record
                if (status === "completed") {
                    // Create payment record if not exists
                    const existingPayment = await Payment.findOne({
                        service_request_id: booking._id
                    });
                    if (!existingPayment) {
                        await Payment.create({
                            service_request_id: booking._id,
                            paid_by: booking.client_id,
                            paid_to: booking.provider_id,
                            amount: booking.final_cost || booking.estimated_cost,
                            payment_status: "pending",
                        });
                    }
                }
            // If completed, create payment record//




            return res.status(200).json({
                message: "Job status updated successfully.",
                data: booking
            });

        }

    } catch (error) {
        next(error);
    }
}


