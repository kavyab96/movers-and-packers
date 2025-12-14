import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { User, Mail, Phone, MapPin, BadgeCheck, Edit3 } from "lucide-react";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { saveUser } from "../../redux/features/userSlice";
import { updateProfileInfoService } from "../../services/userServices";
import AreaMultiSelect from "../../components/area/AreaMultiSelect";
import FullPageLoader from "../../components/loaders/FullPageLoader";

const ProfileInfoCard = ({ user, areas }) => {
    const dispatch = useDispatch();

    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(false);

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

    const handleSave = async () => {
        try {
            setLoading(true);

            const res = await updateProfileInfoService(user._id, formData);

            dispatch(saveUser(res.data.data));  // Update Redux store
            toast.success("Profile updated!");
            setEditMode(false);

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
    placeholder
}) => (
    <div className="flex items-center gap-4 w-full">
        {icon}
        <div className="w-full">
            <p className="text-sm text-muted-foreground">{label}</p>
            {editable ? (
                <input
                    className="border rounded-md p-2 w-full"
                    value={value}
                    placeholder={placeholder}
                    onChange={(e) => onChange(e.target.value)}
                />
            ) : (
                <p className="text-base font-medium">{displayValue}</p>
            )}
        </div>
    </div>
);


export default ProfileInfoCard