
const userDb = require("../Models/userModel");
const { hashPassword } = require("../Utilities/passwordUtilities");

/* admin register function*/
exports.adminRegister = async (req, res, next) => {
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
exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await userDb.find({
            role: { $in: ["user", "provider"] },
            is_active: true
        }).select('-password');
        return res.status(200).json({
            message: "Users fetched successfully",
            data: users
        });

    } catch (error) {
        next(error)
    }
}


/* Update admin profile  by admin*/

exports.updateAdminProfile = async (req, res, next) => {
    try {

        const adminId = req.user.id;
        const { name, email, old_password, new_password } = req.body;
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

        if (old_password || new_password) {
            if (!old_password || !new_password) {
                return res.status(400).json({
                    message: "Both old_password and new_password are required"
                });
            }
            const isMatch = await comparePassword(old_password, admin.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Old password is incorrect" });
            }
            admin.password = await hashPassword(new_password);
        }


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