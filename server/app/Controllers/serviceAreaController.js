import ServiceArea from "../Models/serviceAreaModel.js";
import ServiceRequest from "../Models/serviceRequestModel.js";
import { capitalizeFirst } from "../Utilities/stringHelper.js";
import { getLatLngFromAddress } from "../Utilities/geocode.js";


/* add service area  by admin */
export const addServiceArea = async (req, res, next) => {
    try {
        let { name, city, state, country, postal_code } = req.body;
        const userId = req.user._id; // admin or authorized user


        name = capitalizeFirst(name);
        city = capitalizeFirst(city);
        state = capitalizeFirst(state);
        country = capitalizeFirst(country);

        //  Prevent duplicate area names
        const existingArea = await ServiceArea.findOne({
            name: { $regex: new RegExp(`^${name}$`, "i") } // case-insensitive
        });

        if (existingArea) {
            return res.status(400).json({ error: "This service area already exists.", });
        }


        // Build full address for geocoding
        const fullAddress = `${name}, ${city}, ${state}, ${country}`;
        // Fetch lat/lng via Google API
        const { lat, lng } = await getLatLngFromAddress(fullAddress);

        // Create new area
        const newArea = await ServiceArea.create({
            name,
            city: city || null,
            state: state || null,
            country: country || null,
            postal_code: Array.isArray(postal_code) ? postal_code : [],
            updated_by: userId,

            //AUTOMATIC LAT/LNG HERE
            latitude: lat,
            longitude: lng,
        });

        return res.status(201).json({
            message: "Service area added successfully.",
            data: newArea,
        });


    } catch (error) {
        next(error);
    }
}

/* edit service area  by admin */
export const editServiceArea = async (req, res, next) => {
    try {
        const areaId = req.params.id;
        const userId = req.user._id;

        let { name, city, state, country, postal_code } = req.body;
        // Check if area exists
        const area = await ServiceArea.findById(areaId);
        if (!area) {
            return res.status(404).json({
                message: "Service area not found.",
            });
        }
        // Track whether location fields changed → need new geocode lookup
        let needGeocode = false;

        if (name) {
            name = capitalizeFirst(name);

            const existingArea = await ServiceArea.findOne({
                name: { $regex: new RegExp(`^${name}$`, "i") },
                _id: { $ne: areaId }
            });

            if (existingArea) {
                return res.status(409).json({
                    message: "Another service area with this name already exists.",
                });
            }

            if (area.name !== name) needGeocode = true;

            area.name = name;
        }




        // Format other fields if provided
        // if (city) area.city = capitalizeFirst(city);
        // if (state) area.state = capitalizeFirst(state);
        // if (country) area.country = capitalizeFirst(country);
        // if (postal_code) area.postal_code = Array.isArray(postal_code) ? postal_code : [];

        if (city && area.city !== city) {
            area.city = capitalizeFirst(city);
            needGeocode = true;
        }

        if (state && area.state !== state) {
            area.state = capitalizeFirst(state);
            needGeocode = true;
        }

        if (country && area.country !== country) {
            area.country = capitalizeFirst(country);
            needGeocode = true;
        }

        if (postal_code) {
            area.postal_code = Array.isArray(postal_code) ? postal_code : [];
        }
        // If address changed → recalculate lat/lng        
        if (needGeocode) {

            const fullAddress = `${area.name}, ${area.city}, ${area.state}, ${area.country}`;

            const { lat, lng } = await getLatLngFromAddress(fullAddress);

            // return res.status(400).json({ lat: lat, lng: lng, msg: "hi there" })
            area.latitude = lat;
            area.longitude = lng;
        }

        // Audit trail
        area.updated_by = userId;
        // return res.status(200).json({area:area,lat:needGeocode})

        await area.save();

        return res.status(200).json({
            message: "Service area updated successfully.",
            data: area,
        });

    } catch (error) {
        next(error);
    }
}

/*soft delete service area  by admin */
export const deleteServiceArea = async (req, res, next) => {
    try {
        const areaId = req.params.id;
        const adminId = req.user._id;

        // Find the service area
        const area = await ServiceArea.findById(areaId);

        if (!area) {
            return res.status(404).json({
                error: "Service area not found.",
            });
        }

        // Check if this area is currently used in active service requests
        const activeStatuses = ["pending", "accepted", "in-progress"];

        const activeRequests = await ServiceRequest.findOne({
            status: { $in: activeStatuses },
            is_active: true,
            $or: [
                { pickup_location: areaId },
                { dropoff_location: areaId }
            ]
        });

        if (activeRequests) {
            return res.status(400).json({
                error: "This service area cannot be deleted because it is currently in use.",
                in_use: true
            });
        }
        //------------------------------------------------

        // If already soft-deleted
        if (!area.is_active) {
            return res.status(400).json({
                message: "This service area is already inactive.",
            });
        }

        // Soft delete
        area.is_active = false;
        area.updated_by = adminId;
        await area.save();

        return res.status(200).json({
            message: "Service area deleted successfully (soft deleted).",
            data: area
        });

    } catch (error) {
        next(error);
    }
}

/* list service areas  by admin */
export const listServiceAreas = async (req, res, next) => {
    try {
        const { page = 1, limit = 5 } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        const { search } = req.query;
        const filter = { is_active: true };

        // If search query provided
        if (search) {
            filter.name = { $regex: new RegExp(search, "i") }; // case-insensitive search
        }

        // Fetch areas
        const areas = await ServiceArea.find(filter)
            .sort({ name: 1 }) // Alphabetical order
            .skip(skip)
            .limit(limitNum);


        // TOTAL COUNT (without skip/limit)
        const total = await ServiceArea.find(filter).countDocuments({
            is_active: true,
        });


        return res.status(200).json({
            message: "Service areas fetched successfully.",
            total,
            currentPage: pageNum,
            totalPages: Math.ceil(total / limitNum),
            data: areas
        });

    } catch (error) {
        next(error);
    }
}

/*get all area for dropdown in register form*/

export const getAllAreas = async (req, res, next) => {
    try {

        const areas = await ServiceArea.find(
            { is_active: true },     //  filter
            { name: 1 }              //  return only name + _id
        ).sort({ name: 1 });

        return res.status(200).json({
            success: true,
            data: areas
        });

    } catch (error) {
        next(error);

    }
}