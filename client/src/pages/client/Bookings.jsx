import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Calendar, Truck, Package2, BadgeCheck } from "lucide-react";

const Bookings = () => {
  
  // dummy data (replace with API data)
  const bookings = [
    {
      id: "TB12345",
      pickup: "Kakkanad, Kochi",
      drop: "Calicut",
      date: "2024-12-10",
      items: 12,
      status: "Confirmed",
    },
    {
      id: "TB12346",
      pickup: "Thrissur",
      drop: "Trivandrum",
      date: "2024-12-12",
      items: 8,
      status: "Pending",
    },
  ];

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold tracking-tight">My Bookings</h1>
      <p className="text-muted-foreground">View all your moving & packing service bookings.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

        {bookings.map((b, index) => (
          <Card key={index} className="shadow-sm border hover:shadow-md transition">
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                Booking #{b.id}
                <BadgeCheck className="h-5 w-5 text-primary" />
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">

              {/* Pickup */}
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Pickup</p>
                  <p className="font-medium">{b.pickup}</p>
                </div>
              </div>

              {/* Drop */}
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Drop</p>
                  <p className="font-medium">{b.drop}</p>
                </div>
              </div>

              {/* Date */}
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{b.date}</p>
                </div>
              </div>

              {/* Items */}
              <div className="flex items-center gap-3">
                <Package2 className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Items</p>
                  <p className="font-medium">{b.items} items</p>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 text-xs rounded-full font-medium 
                    ${b.status === "Confirmed" ? "bg-green-100 text-green-700" : 
                    b.status === "Pending" ? "bg-yellow-100 text-yellow-700" : 
                    "bg-red-100 text-red-700"}`}
                >
                  {b.status}
                </span>
              </div>

              {/* Actions */}
              <div className="pt-2 flex gap-3">
                <button className="px-3 py-2 bg-primary text-white text-sm rounded-md hover:bg-primary/90">
                  View Details
                </button>

                <button className="px-3 py-2 border text-sm rounded-md hover:bg-accent">
                  Track
                </button>
              </div>

            </CardContent>
          </Card>
        ))}

      </div>

    </div>
  );
};

export default Bookings;
