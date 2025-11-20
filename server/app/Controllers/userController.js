
import UserDb from "../Models/userModel.js";
import uploadToCloudinary from "../Utilities/imageUpload.js";
import { capitalizeFirst } from "../Utilities/stringHelper.js";

/* Get profile data of logged-in user (client/provider)*/
export const getUserProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const user = await UserDb.findById(userId)
            .populate('service_areas', 'name')
            .select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({
            message: "User profile fetched successfully",
            data: user
        });
    } catch (error) {
        next(error);
    }
}

/* Updating own profile  by user/provider after login*/
export const updateUserProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;
       
        const { name, phone, address, service_areas } = req.body;
        const user = await UserDb.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Validate phone uniqueness (if changed)
        if (phone && phone !== user.phone) {
            const phoneExists = await UserDb.findOne({ phone });
            if (phoneExists) {
                return res.status(400).json({ message: "Phone number already in use" });
            }
        }

        let cloudinaryRes = null;
        if (req.file) {
            cloudinaryRes = await uploadToCloudinary(req.file.path, "profile-pics");
            user.profile_pic = cloudinaryRes;
        }
       
        // Providers can update their service_areas
        if (user.role === "provider" && service_areas) {
            user.service_areas = Array.isArray(service_areas) ? service_areas : [];
        }

        if (name) user.name = capitalizeFirst(name.trim());
        if (phone) user.phone = phone.trim();
        if (address) user.address = address.trim();
        user.updated_by = userId;
        await user.save();

        const updatedUser = user.toObject();
        delete updatedUser.password;

        return res.status(200).json({
            message: "Profile updated successfully",
            data: updatedUser
        });

    } catch (error) {
        next(error);
    }
}