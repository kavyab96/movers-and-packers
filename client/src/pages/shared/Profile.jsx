import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Edit3, BadgeCheck } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator"

import { toast } from "sonner";
import { profilePicUpdateService, adminProfilePicUpdateService } from "../../services/userServices";
import { getKycDocumentsService } from "../../services/providerServices";
import FullPageLoader from "../../components/loaders/FullPageLoader";
import { updateProfilePic } from "../../redux/features/userSlice"
import ProfileInfoCard from "./ProfileInfoCard";
import { useAreas } from "../../context/AreaContext";
import ProviderKycCard from "../provider/ProviderKycCard";



const Profile = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.user);

  //-------kyc documents state for provider--------
  const [kycDocs, setKycDocs] = useState([]);
  const [kycLoading, setKycLoading] = useState(false);

  useEffect(() => {
    if (user?.role === "provider") {
      fetchKycDocuments();
    }
  }, [user]);

  const fetchKycDocuments = async () => {
    try {
      setKycLoading(true);
      const res = await getKycDocumentsService();
      setKycDocs(res.data.data || []);
    } catch (error) {
      toast.error("Failed to fetch KYC documents");
    } finally {
      setKycLoading(false);
    }
  };

  //------kyc documents state for provider--------

  const { areas } = useAreas();

  // Generate initials if no image
  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase()
    : "U";


  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Handle file selection
  const handleImageChange = async (e) => {
    try {
      setLoading(true)
      const file = e.target.files[0];
      if (!file) return;

      // TODO: API Upload Image
      const formData = new FormData();
      formData.append("image", file);
      let res; // 
      if (user.role === "admin") {
        res = await adminProfilePicUpdateService(user._id, formData)
      } else {
        res = await profilePicUpdateService(user._id, formData)
      }

      const newPic = res.data.data.profile_pic;  // New profile picture returned from server
      dispatch(updateProfilePic(newPic));  // Update Redux store

      toast.success("Profile picture updated!");
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error(error.response.data.error || "Profile picture updating failed");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
      // console.log(error);
    }
    finally {
      setLoading(false);
    }

  };

  return (
    <div className=" max-w-6xl mx-auto space-y-8 w-full">
      {loading && <FullPageLoader />}

      {/* Page Title */}
      <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
      <p className="text-muted-foreground">
        View and manage your TransitBee account details.
      </p>

      <div className="w-full space-y-6">
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {/* <div className=" w-full grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch "> */}
          {/* PROFILE HEADER CARD */}
          <Card className="border shadow-sm md:col-span-1 h-full">
            <CardContent className="flex flex-col items-center gap-6 py-8">
              {/* Avatar */}

              {/* Hidden input */}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />

              <div className="relative">
                <Avatar className="h-28 w-28 border">
                  <AvatarImage src={user?.profile_pic} alt={user?.name} />
                  <AvatarFallback className="text-2xl font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-1 right-1 h-8 w-8 flex items-center justify-center
                   bg-primary text-white rounded-full shadow hover:bg-primary/90"
                >

                  <Edit3 className="h-4 w-4" />

                </button>
              </div>


              <Separator className="my-2" />
              {/* Name & Email */}
              <div className="space-y-1 text-center md:text-left w-full flex flex-col items-start">
                <h2 className="text-2xl font-semibold">{user?.name || "Unnamed User"}</h2>

                <div className="flex  gap-2 mt-2 relative">
                  {user.role==='admin' || (user.role==='provider' && user.verification_status==='approved') &&
                  <BadgeCheck className="h-3 w-3 bg-blue-600 text-white rounded-full absolute top-1 left-15" />
                  }
                  <span className="text-sm font-medium capitalize text-primary">
                    {user?.role}
                  </span>
                </div>

                <p className="text-muted-foreground">{user?.email || "-"}</p>
              </div>


            </CardContent>
          </Card>

          {/* USER DETAILS CARD */}
          <div className="md:col-span-2 h-full">
            <ProfileInfoCard user={user} areas={areas} />
          </div>




        </div>
        {/* PROVIDER KYC SECTION */}
        <div>

          {user?.role === "provider" && (
            <ProviderKycCard user={user}
              kycDocs={kycDocs}
              refreshKycDocs={fetchKycDocuments}
            />
          )}
        </div>
      </div>

    </div >
  );
};

export default Profile;
