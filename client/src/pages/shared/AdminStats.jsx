import { Users, UserCheck, Truck } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const StatCard = ({ title, value, icon: Icon, accent }) => {
  return (

    <Card className="border shadow-sm hover:shadow-md transition">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>

        <Icon className={`h-5 w-5 ${accent}`} />
      </CardHeader>

      <CardContent>
        <p className="text-3xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
};

const AdminStats = ({stats,loading}) => {
  if (loading) {
    return <p className="text-muted-foreground">Loading stats...</p>;
  }
  
  
  if (!stats) return null;
  const { totalUsers, totalClients, totalProviders } = stats.user;

  // const totalClients = 120;
  // const totalProviders = 45;
  // const totalUsers = totalClients + totalProviders;

  return (
    <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard
        title="Total Users"
        value={totalUsers}
        icon={Users}
        accent="text-primary"
      />

      <StatCard
        title="Clients"
        value={totalClients}
        icon={UserCheck}
        accent="text-green-600"
      />

      <StatCard
        title="Providers"
        value={totalProviders}
        icon={Truck}
        accent="text-blue-600"
      />
    </div>
  );
};

export default AdminStats;
