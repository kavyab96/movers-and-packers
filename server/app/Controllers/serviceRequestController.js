
import mongoose from "mongoose";
import ServiceRequest from "../Models/serviceRequestModel.js";
import { getDistanceInKm } from "../Utilities/distance.js";

import ServiceArea from "../Models/serviceAreaModel.js";
import PriceChart from "../Models/priceChartModel.js";

/*client creating booking request*/
export const createBooking = async (req, res, next) => {
    try {

        const {
            client_id,
            provider_id,
            service_type,
            pickup_location,
            dropoff_location,
            area_in_square_feet,
            notes,
            requested_date_time,
            distance_km,
            estimated_cost,
        } = req.body;

        if (!client_id || !provider_id || !service_type || !pickup_location || !area_in_square_feet) {
            return res.status(400).json({
                error:
                    "client_id, provider_id, service_type, pickup_location and area_in_square_feet are required.",
            });
        }


        // PACKING: only estimated_cost is required
        if (service_type === "packing") {
            if (!estimated_cost) {
                return res.status(400).json({
                    error: "Estimated cost is required for packing service.",
                });
            }
        }

        // MOVING or BOTH: distance + estimated cost required
        if (service_type !== "packing") {
            if (!distance_km || !estimated_cost) {
                return res.status(400).json({
                    error: "Distance and estimated cost are required for moving or combined services.",
                });
            }
        }


        // Duplicate Booking Check---------------------

        // Convert date to start-of-day and end-of-day for date matching
        const reqDate = new Date(requested_date_time);
        const startOfDay = new Date(reqDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(reqDate.setHours(23, 59, 59, 999));

        const existingBooking = await ServiceRequest.findOne({
            client_id,
            provider_id,
            service_type,
            requested_date_time: { $gte: startOfDay, $lte: endOfDay },
            status: { $ne: "cancelled" }, // ignore cancelled bookings
        });

        if (existingBooking) {
            return res.status(400).json({
                error:
                    "A booking already exists with the same service type, provider, and date. Please choose another date.",
            });
        }
        // Duplicate Booking Check-----------------------


        //  Build the data object to save
        const bookingData = {
            client_id,
            provider_id,
            service_type,
            pickup_location,
            dropoff_location: dropoff_location || undefined,// If service_type === "packing", dropoff_location is optional,
            area_in_square_feet,
            requested_date_time: requested_date_time
                ? new Date(requested_date_time)
                : new Date(),
            notes: notes || null,
            status: "pending",      // client just created booking
            updated_by: client_id,  // initially, the client triggered this

            distance_km: service_type === "packing" ? 0 : Number(distance_km),
            estimated_cost: Number(estimated_cost),
        };

        //Save to DB
        const newBooking = await ServiceRequest.create(bookingData);

        // Respond to client
        return res.status(201).json({
            message: "Booking created successfully",
            data: newBooking,
        });

    } catch (error) {
        next(error);
    }
}


/*client getting list of own booking requests*/
export const getBookings = async (req, res, next) => {
    try {
        // return res.status(200).json({ message: "hi" });
        const clientId = req.user._id;
        const { service_type } = req.query; // filter param

        // Base filter (for client)
        const filter = { client_id: clientId };

        // If service_type filter exists, add it
        if (service_type) {
            filter.service_type = service_type;
        }


        // Fetch all bookings for this client
        const bookings = await ServiceRequest.find(filter)
            .sort({ created_at: -1 })  // latest first
            // .sort({ requested_date_time: -1 })  // 
            .populate("provider_id", "name email phone")  // show provider details
            .populate("pickup_location", "name ")
            .populate("dropoff_location", "name ")
            .populate("payment", "payment_status amount ");

        return res.status(200).json({
            message: "Bookings fetched successfully",
            total: bookings.length,
            data: bookings,
        });
    } catch (error) {
        next(error);
    }
}


/*client viewing booking details of a booking */
export const bookingDetails = async (req, res, next) => {
    try {
        const bookingId = req.params.id;
        const clientId = req.user._id;

        // 1️ Find the booking
        const booking = await ServiceRequest.findById(bookingId)
            .populate("provider_id", "name email phone")
            .populate("client_id", "name email phone")
            .populate("payment", "payment_status amount ");

        // 2️ Check if booking exists and belongs to this client
        if (!booking || booking.client_id._id.toString() !== clientId.toString()) {
            return res.status(404).json({
                message: "Booking not found",
            });
        }

        // 3️ Return booking details
        return res.status(200).json({
            message: "Booking details fetched successfully",
            data: booking,
        });
    } catch (error) {
        next(error);
    }
}


/*client cancelling a booking */
export const cancelBooking = async (req, res, next) => {
    try {
        const bookingId = req.params.id;
        const clientId = req.user._id;
        const { cancellation_reason } = req.body;

        //  Validate ObjectId format BEFORE DB query
        if (!mongoose.Types.ObjectId.isValid(bookingId)) {
            return res.status(400).json({
                message: "Invalid booking ID format",
            });
        }

        // 1️ Find the booking
        const booking = await ServiceRequest.findById(bookingId);

        // 2️ Check if booking exists and belongs to this client
        if (!booking || booking.client_id.toString() !== clientId.toString()) {
            return res.status(404).json({
                message: "Booking not found",
            });
        }

        // 3️ Prevent cancelling completed or already cancelled bookings
        if (["completed", "cancelled"].includes(booking.status)) {
            return res.status(400).json({
                message: `Cannot cancel a booking that is already ${booking.status}.`,
            });
        }

        // 4️ Update booking status and cancellation details
        booking.status = "cancelled";
        booking.cancelled_by = clientId;
        booking.cancellation_reason = cancellation_reason || "Cancelled by client";
        booking.updated_by = clientId;
        // Save changes
        await booking.save();

        return res.status(200).json({
            message: "Booking cancelled successfully",
            data: booking,
        });


    } catch (error) {
        next(error);
    }
}


/*estimated cost and km calculation on booking form*/

export const calculateCost = async (req, res) => {
    try {
        //691dc2fc84ba30eb20c5d531//ett

        //691dbe3b6dcd9e8727894aa3 //ktm
        const { pickup_location, dropoff_location, area_in_square_feet, service_type } = req.body;

        if (!pickup_location || !area_in_square_feet) {
            return res.status(400).json({ error: "Pickup, area, service type required" });
        }

        const pickup = await ServiceArea.findById(pickup_location);
        const dropoff = dropoff_location ? await ServiceArea.findById(dropoff_location) : null;



        if (!pickup) return res.status(400).json({ error: "Invalid pickup location" });
        if (service_type !== "packing" && !dropoff)
            return res.status(400).json({ error: "Dropoff required for moving/both" });

        let distance_km = 0;

        if (service_type !== "packing") {
            distance_km = await getDistanceInKm(
                { lat: pickup.latitude, lng: pickup.longitude },
                { lat: dropoff.latitude, lng: dropoff.longitude }
            );
        }
        // return res.status(200).json({distance_km:distance_km})

        const price = await PriceChart.findOne();
        if (!price) return res.status(500).json({ error: "Pricing chart missing" });

        const estimated_cost =
            price.base_fare +
            distance_km * price.per_km_rate +
            area_in_square_feet * price.per_sqft_rate;

        return res.json({
            base_fare: price.base_fare,
            per_km_rate: price.per_km_rate,
            per_sqft_rate: price.per_sqft_rate,
            distance_km,
            estimated_cost: Math.round(estimated_cost),
        });

    } catch (err) {
        return res.status(500).json({ error: "Server error", details: err.message });
    }
};




