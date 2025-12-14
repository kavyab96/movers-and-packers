import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { getBookingByIdService } from "../../services/bookingServices";
import { createPaymentSession } from "../../services/paymentService";
import { CircleArrowLeft } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"


const PaymentPage = () => {
  const navigate = useNavigate();

  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooking();
  }, []);

  const fetchBooking = async () => {
    try {
      const res = await getBookingByIdService(id);
      setBooking(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    try {
      const payload = { payment_id: booking.payment._id };
      const res = await createPaymentSession(payload);

      window.location.href = res.data.url; // Stripe checkout
    } catch (err) {
      console.error("Payment redirect failed:", err);
        // window.location.href = res.data.url;
    }
  };

  if (loading) {
    return <p className="p-6 text-center text-muted-foreground">Loading payment…</p>;
  }

  if (!booking) {
    return <p className="p-6 text-center text-red-600">Booking not found.</p>;
  }

  return (
    <div className="flex justify-center mt-10 px-4">
      <Card className="w-full max-w-lg shadow-md border">
        <CardHeader >
          {/* Back Button */}
          <div className="mb-2">

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                    <CircleArrowLeft />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Go Back</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

          </div>


          <CardTitle className="text-xl font-bold text-center">Payment Summary</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 ">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 place-items-center">
            {/* Booking ID */}
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Booking ID</p>
              <Badge variant="outline" className="text-base px-3 py-1">
                {booking.booking_id}
              </Badge>
            </div>

            {/* Amount */}
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Amount to Pay</p>
              <p className="text-3xl font-semibold text-green-600">
                ₹{booking.payment.amount}
              </p>
            </div>

            {/* Service Type */}
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Service Type</p>
              <Badge className="text-sm capitalize px-3 py-1">
                {booking.service_type}
              </Badge>
            </div>

            {/* Status */}
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Payment Status</p>
              <Badge
                className={`px-3 py-1 text-sm ${booking.payment.payment_status === "pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-green-100 text-green-700"
                  }`}
              >
                {booking.payment.payment_status}
              </Badge>
            </div>
          </div>

          <div className="flex justify-center">
            {/* Checkout Button */}
            <Button
              onClick={handleCheckout}
              className="w-[50%] py-5 text-lg mt-5"
              variant="default"
            >Proceed to Checkout
            </Button>
          </div>

        </CardContent>
      </Card>
    </div >
  );
};

export default PaymentPage;
