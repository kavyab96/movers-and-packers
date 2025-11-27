import React from "react";
import { useSelector } from "react-redux";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { User, Mail, Phone, MapPin, BadgeCheck } from "lucide-react";

const Profile = () => {
  const user = useSelector((state) => state.user.user);

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* Page Title */}
      <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
      <p className="text-muted-foreground">
        View and manage your TransitBee account details.
      </p>

      {/* USER DETAILS CARD */}
      <Card className="shadow-sm border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Personal Information</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">

          {/* Name */}
          <div className="flex items-center gap-4">
            <User className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="text-base font-medium">{user?.name || "-"}</p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center gap-4">
            <Mail className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="text-base font-medium">{user?.email || "-"}</p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-center gap-4">
            <Phone className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="text-base font-medium">{user?.phone || "-"}</p>
            </div>
          </div>

          {/* Address */}
          <div className="flex items-center gap-4">
            <MapPin className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Address</p>
              <p className="text-base font-medium">{user?.address || "-"}</p>
            </div>
          </div>

          {/* Role */}
          <div className="flex items-center gap-4">
            <BadgeCheck className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Role</p>
              <p className="text-base font-medium capitalize">{user?.role || "-"}</p>
            </div>
          </div>

        </CardContent>
      </Card>

    </div>
  );
};

export default Profile;
