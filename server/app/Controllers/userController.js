
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
        const { id } = req.params;
        const { name, phone, email, address, service_areas } = req.body;
        const user = await UserDb.findById(id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        // return res.status(400).json({areas:service_areas})

        // Validate phone uniqueness (if changed)
        if (phone && phone !== user.phone) {
            const phoneExists = await UserDb.findOne({ phone });

            if (phoneExists) {
                return res.status(400).json({ error: "Phone number already in use" });
            }
        }

        if (email && email !== user.email) {
            const emailExists = await UserDb.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ error: "Email already in use" });
            }
        }


        // Providers can update their service_areas
        if (user.role === "provider" && service_areas) {
            user.service_areas = Array.isArray(service_areas) ? service_areas : [];
        }

        if (name) user.name = capitalizeFirst(name.trim());
        if (phone) user.phone = phone.trim();
        if (email) user.email = email.trim();
        if (address) user.address = address.trim();
        user.updated_by = id;
        await user.save();
        const populatedUser = await UserDb.findById(id)
            .populate("service_areas name") // populate area names
            .select("-password");

        return res.status(200).json({
            message: "Profile updated successfully",
            data: populatedUser
        });

    } catch (error) {
        next(error);
    }
}

/*updating user profile pic only*/
export const updateUserProfilePic = async (req, res, next) => {

    try {
        const { id } = req.params;

        const user = await UserDb.findById(id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        let cloudinaryRes = null;
        if (req.file) {
            cloudinaryRes = await uploadToCloudinary(req.file.path, "profile-pics");
            user.profile_pic = cloudinaryRes;
        }
        user.updated_by = id;
        await user.save();
        const updatedUser = {
            _id: user._id,
            name: user.name,
            profile_pic: user.profile_pic
        };

        return res.status(200).json({
            message: "Profile picture updated successfully",
            data: updatedUser
        });


    } catch (error) {
        next(error);
    }
}