import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Truck,
  PackageCheck,
  Clock,
  IndianRupee,
} from "lucide-react";

const ProviderStats = ({stats,loading}) => {

  if (loading) {
    return <p className="text-muted-foreground">Loading stats...</p>;
  }
  
  
  if (!stats) return null;
  const { activeJobs, completedJobs, distanceCovered,earnings } = stats.data;

  return (
    <div className=" mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

      {/* Active Jobs */}
      <Card className="border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Active Jobs
          </CardTitle>
          <Clock className="h-5 w-5 text-primary" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{activeJobs}</p>
          <p className="text-xs text-muted-foreground">
            Ongoing services
          </p>
        </CardContent>
      </Card>

      {/* Completed Jobs */}
      <Card className="border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Completed Jobs
          </CardTitle>
          <PackageCheck className="h-5 w-5 text-primary" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{completedJobs}</p>
          <p className="text-xs text-muted-foreground">
            Successfully delivered
          </p>
        </CardContent>
      </Card>

      {/* Total Distance Covered */}
      <Card className="border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Distance Covered
          </CardTitle>
          <Truck className="h-5 w-5 text-primary" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{distanceCovered} km</p>
          <p className="text-xs text-muted-foreground">
            Total service distance
          </p>
        </CardContent>
      </Card>

      {/* Earnings */}
      <Card className="border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Earnings
          </CardTitle>
          <IndianRupee className="h-5 w-5 text-primary" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">₹ {earnings}</p>
          <p className="text-xs text-muted-foreground">
            Total earnings
          </p>
        </CardContent>
      </Card>

    </div>
  );
};

export default ProviderStats;
