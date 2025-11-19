import ServiceArea from "../Models/serviceAreaModel.js";
import { capitalizeFirst } from "../Utilities/stringHelper.js";
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
            return res.status(409).json({ message: "This service area already exists.", });
        }

        // Create new area
        const newArea = await ServiceArea.create({
            name,
            city: city || null,
            state: state || null,
            country: country || null,
            postal_code: Array.isArray(postal_code) ? postal_code : [],
            updated_by: userId
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

            area.name = name;
        }


        // Format other fields if provided
        if (city) area.city = capitalizeFirst(city);
        if (state) area.state = capitalizeFirst(state);
        if (country) area.country = capitalizeFirst(country);
        if (postal_code) area.postal_code = Array.isArray(postal_code) ? postal_code : [];

        // Audit trail
        area.updated_by = userId;

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
                message: "Service area not found.",
            });
        }

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

        const { search } = req.query;
        const filter = { is_active: true };

        // If search query provided
        if (search) {
            filter.name = { $regex: new RegExp(search, "i") }; // case-insensitive search
        }

        // Fetch areas
        const areas = await ServiceArea.find(filter)
            .sort({ name: 1 }); // Alphabetical order

        return res.status(200).json({
            message: "Service areas fetched successfully.",
            total: areas.length,
            data: areas
        });

    } catch (error) {
        next(error);
    }
}