import uploadToCloudinary from "../Utilities/imageUpload.js";

import userDb from "../Models/userModel.js";
// const { hashPassword, compairePassword } = require("../Utilities/passwordUtilities");
import { hashPassword, compairePassword } from "../Utilities/passwordUtilities.js";
// const ServiceRequest = require("../Models/serviceRequestModel.js");
import ServiceRequest from "../Models/serviceRequestModel.js";
// const { capitalizeFirst } = require("../Utilities/stringHelper.js");
import { capitalizeFirst } from "../Utilities/stringHelper.js";

import KycDocumentDb from "../Models/kycDocumentModel.js";


/* admin register function*/
export const adminRegister = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        if (!email || !password || !name) {
            return res.status(400).json({ message: "All feilds are required" });
        }
        const adminExists = await userDb.findOne({ email, role: "admin" });
        if (adminExists) {
            return res.status(400).json({ message: "Admin with this email already exists" });
        }
        const hasedPassword = await hashPassword(password);
        const newAdmin = new userDb({
            name, email,
            password: hasedPassword,
            role: "admin"
        })
        const saved = await newAdmin.save();
        if (saved) {
            return res.status(201).json({
                message: "Admin registered successfully", saved
            });
        }

    } catch (error) {
        next(error)
    }
}


/* Get all users list (clients and providers) */
export const getAllUsers = async (req, res, next) => {
    try {
        const { page = 1, limit = 2, search, role } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        /*----base filter----*/
        const filter = {
            role: { $in: ["user", "provider"] },
            is_active: true,
        };
        /*--- Role filter------------*/
        if (role && role !== "all") {
            filter.role = role;
        } else {
            filter.role = { $in: ["user", "provider"] };
        }

        /*----search filter----*/
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { phone: { $regex: search, $options: "i" } },
            ];
        }



        const users = await userDb.find(filter)
            .select('-password')
            .sort({ created_at: -1 })
            .skip(skip)
            .limit(limitNum);


        // TOTAL COUNT (without skip/limit)
        const total = await userDb.countDocuments(filter);

        return res.status(200).json({
            message: "Users fetched successfully.",
            total,
            currentPage: pageNum,
            totalPages: Math.ceil(total / limitNum),
            data: users
        });

    } catch (error) {
        next(error)
    }
}

/* Get all users list (clients and providers) */
export const getAllBookings = async (req, res, next) => {
    try {
        const { page = 1, limit = 5 } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;


        const jobs = await ServiceRequest.find({
            is_active: true
        }).populate("client_id", "name")
            .populate("provider_id", "name")
            .populate("pickup_location", "name")
            .populate("dropoff_location", "name")
            .select("booking_id client_id provider_id service_type requested_date_time status tracking_status pickup_location dropoff_location area_in_square_feet created_at")
            .sort({ created_at: -1 })
            .skip(skip)
            .limit(limitNum);


        // return res.status(200).json({
        //     message: "bookings fetched successfully",
        //     data: jobs
        // });


        // TOTAL COUNT (without skip/limit)
        const total = await ServiceRequest.countDocuments({
            is_active: true,
        });



        return res.status(200).json({
            message: "Bookings fetched successfully.",
            total,
            currentPage: pageNum,
            totalPages: Math.ceil(total / limitNum),
            data: jobs
        });

    } catch (error) {
        next(error)
    }
}



/*soft-delete user/provider by admin*/
export const userDelete = async (req, res, next) => {
    try {

        const userId = req.params.id;
        const adminId = req.user.id;

        //  Checking user exists
        const user = await userDb.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Admin must NOT be allowed to delete other admins
        if (user.role === "admin") {
            return res.status(403).json({
                message: "You are not allowed to modify another admin account"
            });
        }


        //Toggle soft delete
        user.is_active = !user.is_active;
        user.updated_by = adminId;
        const updatedUser = await user.save();
        return res.status(200).json({
            message: user.is_active
                ? "User account activated successfully"
                : "User account deactivated (soft-deleted) successfully",
            data: {
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                is_active: updatedUser.is_active,
                updated_by: updatedUser.updated_by
            }
        });

    } catch (error) {
        next(error)
    }
}



/* Update admin profile  by admin*/

export const updateAdminProfile = async (req, res, next) => {
    try {
        const adminId = req.user.id; // token middleware sets req.user
        const { name, email, phone, address, old_password, new_password } = req.body;
        const admin = await userDb.findOne({ _id: adminId, role: "admin" });
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }
        if (name) {
            admin.name = name;
        }
        if (email) {
            const emailExists = await userDb.findOne({
                email,
                role: "admin",
                _id: { $ne: adminId }      // exclude current admin
            });
            if (emailExists) {
                return res.status(400).json({ message: "Email already in use" });
            }
            admin.email = email;
        }


        // Validate phone uniqueness (if changed)
        if (phone && phone !== admin.phone) {
            const phoneExists = await userDb.findOne({ phone });

            if (phoneExists) {
                return res.status(400).json({ error: "Phone number already in use" });
            }
        }

        if (old_password || new_password) {
            if (!old_password || !new_password) {
                return res.status(400).json({
                    message: "Both old_password and new_password are required"
                });
            }
            const isMatch = await compairePassword(old_password, admin.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Old password is incorrect" });
            }
            admin.password = await hashPassword(new_password);
        }

        if (name) admin.name = capitalizeFirst(name.trim());
        if (phone) admin.phone = phone.trim();
        if (email) admin.email = email.trim();
        if (address) admin.address = address.trim();
        admin.updated_by = adminId;

        /* ---------- 4. Save Changes ---------- */
        const updatedAdmin = await admin.save();
        /* ----------  Save Changes ---------- */

        const result = updatedAdmin.toObject();
        delete result.password;
        return res.status(200).json({
            message: "Admin profile updated successfully",
            data: result
        });


    } catch (error) {
        next(error)
    }
}

/*updating user profile pic only*/
export const updateAdminProfilePic = async (req, res, next) => {

    try {
        const { id } = req.params;

        const user = await userDb.findById(id);
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

/* Verify or reject provider by admin*/

export const verifyProvider = async (req, res, next) => {
    try {

        const userId = req.params.id;
        const adminId = req.user.id;
        const { status } = req.body; // expected values: "approved" or "rejected"

        //  Checking user exists
        const user = await userDb.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Only providers can be verified
        if (user.role !== "provider") {
            return res.status(400).json({
                message: "Only provider accounts can be verified or rejected"
            });
        }


        //  Validate status input
        if (!status || !["approved", "rejected", "pending"].includes(status)) {
            return res.status(400).json({
                message: "Invalid status. Allowed values: approved, rejected , pending"
            });
        }

        // Set verification status
        user.verification_status = status;
        user.updated_by = adminId;

        await KycDocumentDb.findOneAndUpdate(
            { user_id: userId, status: "pending" },
            {
                status: status,
                updated_by: adminId
            },
            { new: true }
        );




        const updatedUser = await user.save();


        return res.status(200).json({
            message: `Provider has been ${status} successfully`,
            data: {
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                verification_status: updatedUser.verification_status,
                updated_by: updatedUser.updated_by
            }
        });

    } catch (error) {
        next(error)
    }
}

/* Get admin profile by admin*/
export const adminProfile = async (req, res, next) => {
    try {
        const adminId = req.user.id; // token middleware sets req.user
        const admin = await userDb.findOne({ _id: adminId, role: "admin" }).select('-password');
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }
        return res.status(200).json({
            message: "Admin profile fetched successfully",
            data: admin
        });
    } catch (error) {
        next(error)
    }
}

/* Admin dashboard stats */
export const dashboardStats = async (req, res, next) => {
    try {
        const [
            totalUsers,
            totalProviders,
            totalClients
        ] = await Promise.all([
            userDb.countDocuments({
                role: { $in: ["user", "provider"] },
                is_active: true
            }),
            userDb.countDocuments({
                role: "provider",
                is_active: true
            }),
            userDb.countDocuments({
                role: "user",
                is_active: true
            })
        ]);

        return res.status(200).json({
            message: "Dashboard stats fetched successfully",
            data: {
                user: {
                    totalUsers,
                    totalProviders,
                    totalClients
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

/*view provider kyc doc by admin*/

export const viewProviderKycdoc = async (req, res, next) => {
    try {
        // return res.status(404).json({ message: "Admin not found" });
        const adminId = req.user.id;
        const providerId = req.params.id;

        //  Check provider exists
        const provider = await userDb.findById(providerId);
        if (!provider) {
            return res.status(404).json({
                message: "Provider not found"
            });
        }

        //  Ensure user is provider
        if (provider.role !== "provider") {
            return res.status(400).json({
                message: "KYC documents are only available for providers"
            });
        }

        //  Fetch KYC documents
        const kycDocs = await KycDocumentDb.find({
            user_id: providerId,
            is_active: true
        })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Provider KYC documents fetched successfully",
            data: kycDocs
        });
    } catch (error) {
        next(error)
    }
}


