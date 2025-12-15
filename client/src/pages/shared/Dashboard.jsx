import { useSelector } from "react-redux";
import UserStats from "./UserStats";
import ProviderStats from "./ProviderStats";
import AdminStats from "./AdminStats";
import QuickActions from "./QuickActions";
import { getAdminDashboardStats, getProviderDashboardStats, getUserDashboardStats } from "../../services/dashboardServices";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const { user } = useSelector((state) => state.user);


  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (user?.role === "admin") {
      fetchAdminStats();
    }
    if (user?.role === "provider") {
      fetchProviderStats();
    }
    if (user?.role === "user") {
      fetchUserStats();
    }
  }, [user]);

  const fetchAdminStats = async () => {
    try {
      setLoading(true);
      const res = await getAdminDashboardStats();
      setStats(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const fetchProviderStats = async () => {
    try {
      setLoading(true);
      const res = await getProviderDashboardStats();
      setStats(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      setLoading(true);
      const res = await getUserDashboardStats();
      setStats(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">
        Welcome to TransitBee
      </h1>

      <p className="text-muted-foreground">
        Your dashboard overview.
      </p>

      {/* Role-based stats */}
      {user?.role === "user" &&
        (
          <UserStats stats={stats} loading={loading} />
        )
      }

      {user?.role === "provider" &&
        (
          <ProviderStats stats={stats} loading={loading} />
        )
      }

      {/* Role-based stats */}
      {user?.role === "admin" && (
        <AdminStats stats={stats} loading={loading} />
      )}

      {/* Common section */}

      {/* Quick Actions Section */}
      <QuickActions role={user?.role} />
    </div>
  );
};

export default Dashboard;
