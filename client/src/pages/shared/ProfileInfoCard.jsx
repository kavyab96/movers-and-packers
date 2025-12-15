import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { User, Mail, Phone, MapPin, BadgeCheck, Edit3 } from "lucide-react";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { saveUser } from "../../redux/features/userSlice";
import { updateProfileInfoService, adminUpdateProfileInfoService } from "../../services/userServices";
import AreaMultiSelect from "../../components/area/AreaMultiSelect";
import FullPageLoader from "../../components/loaders/FullPageLoader";

const ProfileInfoCard = ({ user, areas }) => {
    const dispatch = useDispatch();

    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        address: user?.address || "",
        service_areas: user?.service_areas?.map(a => a._id) || [],
    });


    const toggleEditMode = () => {
        if (editMode) {
            // Reset formData when closing edit mode
            setFormData({
                name: user?.name || "",
                email: user?.email || "",
                phone: user?.phone || "",
                address: user?.address || "",
                service_areas: user?.service_areas?.map(a => a._id) || [],
            });
        }
        setEditMode(!editMode);
    };


    const validators = {
        name: (value) =>
            /^[A-Za-z\s]+$/.test(value) || "Name can contain only letters and spaces",

        email: (value) =>
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || "Invalid email address",

        phone: (value) =>
            /^\d{10}$/.test(value) || "Phone must be exactly 10 digits",

        address: (value) =>
            /^[A-Za-z0-9\s-]+$/.test(value) ||
            "Address can contain letters, numbers, spaces and '-'",
    };
    const validateForm = () => {
        const newErrors = {};

        // NAME
        if (!formData.name || validators.name(formData.name) !== true) {
            newErrors.name = validators.name(formData.name);
        }

        // EMAIL
        if (!formData.email || validators.email(formData.email) !== true) {
            newErrors.email = validators.email(formData.email);
        }

        // PHONE (optional but if present must be valid)
        if (formData.phone && validators.phone(formData.phone) !== true) {
            newErrors.phone = validators.phone(formData.phone);
        }

        // ADDRESS (optional but if present must be valid)
        if (formData.address && validators.address(formData.address) !== true) {
            newErrors.address = validators.address(formData.address);
        }

        setErrors(newErrors);

        // return true if no errors
        return Object.keys(newErrors).length === 0;
    };



    const handleSave = async () => {
        if (!validateForm()) {
            toast.error("Please fix the errors before saving");
            return;
        }
        try {
            setLoading(true);
            let res;
            if (user.role === "admin") {
                console.log(user._id, 'from profilecard');

                res = await adminUpdateProfileInfoService(user._id, formData);
            } else {
                res = await updateProfileInfoService(user._id, formData);
            }

            dispatch(saveUser(res.data.data));  // Update Redux store
            toast.success("Profile updated!");
            setEditMode(false);
            setErrors({}); // clear errors

        } catch (error) {
            if (error.response?.status === 400) {
                toast.error(error.response.data.error || "Profile update failed");
            } else {
                toast.error("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (

        <Card className="h-full">
            {loading && <FullPageLoader />}

            {/* HEADER WITH EDIT BUTTON */}
            <CardHeader className="relative">
                <CardTitle className="text-lg font-semibold">
                    Personal Information
                </CardTitle>

                {/* EDIT ICON */}
                <button
                    onClick={toggleEditMode}
                    className="absolute top-3 right-3 text-primary hover:text-primary/80"
                >
                    <Edit3 className="w-5 h-5" />
                </button>
            </CardHeader>

            <CardContent className="space-y-4">

                {/* NAME + EMAIL */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* NAME */}
                    <ProfileField
                        icon={<User className="h-5 w-5 text-primary" />}
                        label="Name"
                        editable={editMode}
                        value={formData.name}
                        placeholder="Enter name"
                        onChange={(v) => setFormData({ ...formData, name: v })}
                        displayValue={user?.name}
                        error={errors.name}
                    />

                    {/* EMAIL */}
                    <ProfileField
                        icon={<Mail className="h-5 w-5 text-primary" />}
                        label="Email"
                        editable={editMode}
                        value={formData.email}
                        placeholder="Enter email"
                        onChange={(v) => setFormData({ ...formData, email: v })}
                        displayValue={user?.email}
                        error={errors.email}
                    />
                </div>

                {/* PHONE + ADDRESS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* PHONE */}
                    <ProfileField
                        icon={<Phone className="h-5 w-5 text-primary" />}
                        label="Phone"
                        editable={editMode}
                        value={formData.phone}
                        placeholder="Enter phone"
                        onChange={(v) => setFormData({ ...formData, phone: v })}
                        displayValue={user?.phone}
                        error={errors.phone}
                    />

                    {/* ADDRESS */}
                    <ProfileField
                        icon={<MapPin className="h-5 w-5 text-primary" />}
                        label="Address"
                        editable={editMode}
                        value={formData.address}
                        placeholder="Enter address"
                        onChange={(v) => setFormData({ ...formData, address: v })}
                        displayValue={user?.address}
                        error={errors.address}
                        isTextarea
                    />
                </div>




                {/* ROLE – NON EDITABLE */}
                {/* <div className="flex items-center gap-4">
                    <BadgeCheck className="h-5 w-5 text-primary" />
                    <div>
                        <p className="text-sm text-muted-foreground">Role</p>
                        <p className="text-base font-medium capitalize">{user?.role}</p>
                    </div>
                </div> */}


                {/* SERVICE AREAS */}
                {user.role === "provider" && (
                    <div className="flex items-start gap-4 w-full">
                        <MapPin className="h-5 w-5 text-primary mt-2" />

                        <div className="w-full md:w-[43%]">
                            <p className="text-sm text-muted-foreground">Service Areas</p>

                            {editMode ? (
                                <AreaMultiSelect
                                    areas={areas}
                                    value={formData.service_areas}
                                    onChange={(v) =>
                                        setFormData({ ...formData, service_areas: v })
                                    }
                                />
                            ) : (
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {user?.service_areas?.map((a) => (
                                        <span
                                            key={a._id}
                                            className="px-2 py-1 bg-secondary text-sm rounded-md"
                                        >
                                            {a.name}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}


                {editMode && (
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                    >
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                )}
            </CardContent>
        </Card>

    )
}


const ProfileField = ({
    icon,
    label,
    editable,
    value,
    onChange,
    displayValue,
    placeholder,
    error,
    isTextarea = false,
}) => (
    <div className="flex items-center gap-4 w-full">
        {icon}
        <div className="w-full">
            <p className="text-sm text-muted-foreground">{label}</p>
            {editable ? (
                <>
                    {isTextarea ? (
                        <textarea
                            rows={3}
                            className={`border rounded-md p-2 w-full resize-none ${error ? "border-red-500 focus:ring-red-500" : ""
                                }`}
                            value={value}
                            placeholder={placeholder}
                            onChange={(e) => onChange(e.target.value)}
                        />
                    ) : (
                        <input
                            className={`border rounded-md p-2 w-full ${error ? "border-red-500 focus:ring-red-500" : ""
                                }`}
                            value={value}
                            placeholder={placeholder}
                            onChange={(e) => onChange(e.target.value)}
                        />
                    )}
                    {error && (
                        <p className="text-xs text-red-500 mt-1">{error}</p>
                    )}
                </>
            ) : (
                <p className="text-base font-medium">{displayValue}</p>
            )}
        </div>
    </div>
);


export default ProfileInfoCard