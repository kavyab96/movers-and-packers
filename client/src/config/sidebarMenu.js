export const sidebarMenu = {
  user: [
    { label: "Dashboard", icon: "Home", path: "/user/dashboard" },
    { label: "Book Service", icon: "Truck", path: "/user/book-service" },
    { label: "Bookings", icon: "BookCheck", path: "/user/bookings" },
    { label: "Profile", icon: "UserRound", path: "/user/profile" },
    // { label: "Settings", icon: "Settings", path: "/user/boo-service" },
  ],

  admin: [
    { label: "Dashboard", icon: "LayoutDashboard", path: "/admin/dashboard" },
    { label: "Users", icon: "Users", path: "/admin/users" },
    { label: "Service Requests", icon: "FileCheck", path: "/admin/service-requests" },
    { label: "Service Areas", icon: "Building2", path: "/admin/service-areas" },
    // { label: "Reports", icon: "BarChartBig", path: "/admin/reports" },
    // { label: "Disputs", icon: "AlertTriangle", path: "/admin/disputs" },
    { label: "Profile", icon: "UserRound", path: "/admin/profile" },
    // { label: "Logout", icon: "Settings", path: "/admin/settings" },
  ],

  provider: [
    { label: "Dashboard", icon: "LayoutDashboard", path: "/provider/dashboard" },
    { label: "Jobs", icon: "ClipboardList", path: "/provider/jobs" },
    { label: "Earnings", icon: "Wallet", path: "/provider/earnings" },
    { label: "Profile", icon: "UserRound", path: "/provider/profile" },
    // { label: "Settings", icon: "Settings", path: "/provider/settings" },
  ],
};
