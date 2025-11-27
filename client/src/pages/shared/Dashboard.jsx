import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Package, CalendarCheck, Activity } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="space-y-6">

      {/* Page Title */}
      <h1 className="text-2xl font-bold tracking-tight">Welcome to TransitBee</h1>
      <p className="text-muted-foreground">Your moving & packing dashboard overview.</p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <Card className="shadow-sm border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Bookings</CardTitle>
            <CalendarCheck className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">12</p>
            <p className="text-xs text-muted-foreground">Completed bookings</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Jobs</CardTitle>
            <Package className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">3</p>
            <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Moved Items</CardTitle>
            <Truck className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">28</p>
            <p className="text-xs text-muted-foreground">Successful deliveries</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Activity</CardTitle>
            <Activity className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">5</p>
            <p className="text-xs text-muted-foreground">Recent interactions</p>
          </CardContent>
        </Card>

      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">

        <Card className="border shadow-sm hover:shadow-md transition">
          <CardHeader>
            <CardTitle>Book a Service</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Plan your next move or packing service easily.
            <div className="mt-4">
              <a
                href="/user/book-service"
                className="px-4 py-2 bg-primary text-white rounded-md text-sm hover:bg-primary/90"
              >
                Book Now
              </a>
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm hover:shadow-md transition">
          <CardHeader>
            <CardTitle>Track Your Orders</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            View status updates of your current and past bookings.
            <div className="mt-4">
              <a
                href="/user/orders"
                className="px-4 py-2 bg-primary text-white rounded-md text-sm hover:bg-primary/90"
              >
                View Orders
              </a>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default Dashboard;
