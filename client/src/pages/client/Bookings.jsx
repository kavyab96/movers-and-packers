import React, { useEffect, useState } from "react";
import { getUserBookingsService } from "../../services/userServices";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Calendar, Truck, Package2, BadgeCheck, Package } from "lucide-react";
import { formatDate } from "../../utils/format"
// import { createPaymentSession } from "../../services/paymentService";
import { useNavigate } from "react-router-dom";


const Bookings = () => {
    const navigate = useNavigate();

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load user bookings when page opens
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await getUserBookingsService(); // your service
                setBookings(response.data.data || []);
            } catch (err) {
                console.error("Failed to load bookings:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);


    // const handleStripePayment = async (booking) => {
    //     try {
    //         // const res = await axios.post(`/api/payment/create-stripe-session`, {
    //         //     payment_id: booking.payment._id,
    //         // });
    //         // console.log(booking);
    //         const data ={
    //             payment_id:booking.payment._id
    //         }            
    //         const res = createPaymentSession(data);

    //         console.log("Stripe session created:", res.data);
    //         // Redirect user to Stripe Checkout
    //         // window.location.href = res.data.url;

    //     } catch (err) {
    //         console.error(err);
    //         alert("Payment failed. Try again.");
    //     }
    // };


    if (loading) {
        return <p className="p-4">Loading your bookings...</p>;
    }

    if (bookings.length === 0) {
        return (
            <div className="p-4">
                <h2 className="text-xl font-semibold">No Bookings Found</h2>
                <p className="text-muted-foreground mt-2">
                    You haven't booked any services yet.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">

            <h1 className="text-2xl font-bold tracking-tight">My Bookings</h1>
            <p className="text-muted-foreground">Your moving & packing bookings.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                {bookings.map((b) => (
                    <Card key={b._id} className="shadow-sm border hover:shadow-md transition">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center justify-between">
                                Booking #{b.booking_id}
                                {/* <BadgeCheck className="h-5 w-5 text-primary" /> */}
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4">

                            <div className="grid grid-cols-2 gap-3 place-items-stretch ">
                                {/* Pickup */}
                                <div className="flex items-center gap-3">
                                    <MapPin className="h-5 w-5 text-primary" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Pickup</p>
                                        <p className="font-medium">{b.pickup_location?.name}</p>
                                    </div>
                                </div>


                                {b.service_type !== "packing" && (
                                    <div className="flex items-center gap-3">
                                        <Truck className="h-5 w-5 text-primary" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Drop</p>
                                            <p className="font-medium">{b.dropoff_location?.name}</p>
                                        </div>
                                    </div>
                                )}
                                {/* </div>
                            <div className="grid grid-cols-2 gap-3 place-items-stretch "> */}
                                {/* Date */}
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-5 w-5 text-primary" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Date</p>
                                        <p className="font-medium">{formatDate(b.requested_date_time)}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Package className="h-5 w-5 text-primary" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Service Type</p>
                                        <p className="font-medium capitalize">{b.service_type}</p>
                                    </div>
                                </div>


                                {/* </div> */}


                                {/* Status */}
                                {/* <div className="grid grid-cols-2 gap-3 place-items-stretch "> */}
                                <div className="flex items-center gap-3">
                                    <Package2 className="h-5 w-5 text-primary" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Booking Staus</p>
                                        <p
                                            className={`px-3 py-1 text-xs rounded-full font-medium 
                                        ${b.status === "accepted"
                                                    ? "bg-green-100 text-green-700"
                                                    : b.status === "pending"
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : b.status === "completed"
                                                            ? "bg-blue-100 text-blue-700"
                                                            : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {b.status}
                                        </p>
                                    </div>
                                </div>
                                {/* </div> */}


                                {/* Payment Status (ONLY IF PAYMENT EXISTS) */}
                                <div className="flex items-center gap-3">
                                    <BadgeCheck className="h-5 w-5 text-primary" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Payment</p>

                                        {b.payment ? (
                                            <p
                                                className={`px-3 py-1 text-xs rounded-full font-medium 
                                                    ${b.payment.payment_status === "completed"
                                                        ? "bg-green-100 text-green-700"
                                                        : b.payment.payment_status === "pending"
                                                            ? "bg-yellow-100 text-yellow-700"
                                                            : "bg-red-100 text-red-700"
                                                    }`}
                                            >
                                                {b.payment.payment_status} — ₹{b.payment.amount}
                                            </p>
                                        ) : (
                                            <p className="text-muted-foreground text-sm">No payment yet</p>
                                        )}
                                    </div>
                                </div>

                            </div>






                            {/* Actions */}
                            <div className="pt-2 flex gap-3">
                                <button className="px-3 py-2 bg-primary text-white dark:text-black text-sm rounded-md hover:bg-primary/90">
                                    View Details
                                </button>

                                {/* Pay Now button — only if payment exists and is pending */}
                                {b.payment && b.payment.payment_status === "pending" && (
                                    <button
                                        className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                        // onClick={() => handleStripePayment(b)}
                                        onClick={() => navigate(`/user/payment/${b._id}`)}

                                    >
                                        Pay Now
                                    </button>
                                )}

                            </div>

                        </CardContent>
                    </Card>
                ))}

            </div>
        </div>
    );
};

export default Bookings;
