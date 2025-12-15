import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  ClipboardList,
  Clock,
  CheckCircle,
  Truck ,
  CheckSquare,
  XCircle,
} from "lucide-react";


const UserStats = ({ stats, loading }) => {
  if (loading) {
    return <p className="text-muted-foreground">Loading stats...</p>;
  }


  if (!stats) return null;
  const { totalBookings, awaitingBookings, completedBookings, ongoingBookings, cancelledBookings, confirmedBookings } = stats.data;

  return (

    <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6">

      <Card>
        <CardHeader className="flex justify-between pb-2">
          <CardTitle className="text-sm ">Total Booking Requests</CardTitle>
          <ClipboardList className="h-5 w-5 text-sky-500" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{totalBookings}</p>
          <p className="text-xs text-muted-foreground">
            Total bookings
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex justify-between pb-2">
          <CardTitle className="text-sm">Awaiting Bookings</CardTitle>
          <Clock className="h-5 w-5 text-sky-500" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{awaitingBookings}</p>
          <p className="text-xs text-muted-foreground">
            Awaiting confirmation
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex justify-between pb-2">
          <CardTitle className="text-sm">Confirmed Bookings</CardTitle>
          <CheckCircle className="h-5 w-5 text-sky-500" />
        </CardHeader>

        <CardContent>
          <p className="text-2xl font-bold">{confirmedBookings}</p>
          <p className="text-xs text-muted-foreground">
            Confirmed bookings
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex justify-between pb-2">
          <CardTitle className="text-sm">Ongoing Bookings</CardTitle>
          <Truck className="h-5 w-5 text-sky-500 animate-spin-slow" />
        </CardHeader>

        <CardContent>
          <p className="text-2xl font-bold">{ongoingBookings}</p>
          <p className="text-xs text-muted-foreground">
            Ongoing bookings
          </p>
        </CardContent>
      </Card>


      <Card>
        <CardHeader className="flex justify-between pb-2">
          <CardTitle className="text-sm">Completed Bookings</CardTitle>
          <CheckSquare className="h-5 w-5 text-sky-500" />
        </CardHeader>

        <CardContent>
          <p className="text-2xl font-bold">{completedBookings}</p>
          <p className="text-xs text-muted-foreground">
            Completed bookings
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex justify-between pb-2">
          <CardTitle className="text-sm">Cancelled Bookings</CardTitle>
          <XCircle className="h-5 w-5 text-sky-500" />
        </CardHeader>

        <CardContent>
          <p className="text-2xl font-bold">{cancelledBookings}</p>
          <p className="text-xs text-muted-foreground">
            Cancelled bookings
          </p>
        </CardContent>
      </Card>




    </div>
  );
};

export default UserStats;
