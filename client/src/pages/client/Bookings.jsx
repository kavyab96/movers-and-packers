import React, { useEffect, useState } from "react";
import { getUserBookingsService } from "../../services/userServices";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Calendar, Truck, Package2, BadgeCheck, Package } from "lucide-react";
import { formatDate } from "../../utils/format"
// import { createPaymentSession } from "../../services/paymentService";
import { useNavigate } from "react-router-dom";
// import FullPageLoader from "../../components/loaders/FullPageLoader";
import DataTablePagination from "../../components/table/DataTablePagination";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

import BookingCardSkeleton from "../../components/skeletons/BookingCardSkeleton";



const Bookings = () => {
    const navigate = useNavigate();

    const [totalRecords, setTotalRecords] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(2);

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dateFilter, setDateFilter] = useState("month");


    // Load user bookings when page opens
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setLoading(true);

                const response = await getUserBookingsService({ page: currentPage, limit: itemsPerPage, dateFilter }); // your service
                setBookings(response.data.data || []);
                setTotalPages(response.data.totalPages || 1);
                // setCurrentPage(response.data.currentPage || 1);
                setTotalRecords(response.data.total || 0);
            } catch (err) {
                console.error("Failed to load bookings:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [currentPage, itemsPerPage, dateFilter]);


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


    // if (loading) {
    //     return <FullPageLoader />;
    //     // return <p className="p-4">Loading your bookings...</p>;
    // }

    if (!loading && bookings.length === 0) {
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

            <div className="flex justify-between">
                <p className="text-sm text-muted-foreground">
                    Total bookings:{" "}
                    <span className="font-medium text-foreground">
                        {totalRecords}
                    </span>
                </p>

                {/* filter  starts*/}
                {/* Date Filter */}
                <Select
                    value={dateFilter}
                    onValueChange={(value) => {
                        setDateFilter(value);
                        setCurrentPage(1); // reset pagination
                    }}
                >
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filter by date" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All bookings</SelectItem>
                        <SelectItem value="week">This Week</SelectItem>
                        <SelectItem value="month">This Month</SelectItem>
                    </SelectContent>
                </Select>
                {/* filter  ends*/}
            </div>


            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                {loading
                    ? Array.from({ length: itemsPerPage }).map((_, i) => (
                        <BookingCardSkeleton key={i} />
                    ))
                    :
                    bookings.map((b) => (
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
                    ))

                }

            </div>



            <DataTablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                onPageChange={(page) => setCurrentPage(page)}
                onItemsPerPageChange={(value) => {
                    setItemsPerPage(value);
                    setCurrentPage(1);
                }}
                disabled={loading}
            />

        </div>
    );
};




// const BookingCardSkeleton = () => {
//     return (
//         <Card className="border shadow-sm">
//             <CardHeader>
//                 <Skeleton className="h-5 w-40" />
//             </CardHeader>

//             <CardContent className="space-y-4">
//                 <div className="grid grid-cols-2 gap-3">
//                     {Array.from({ length: 6 }).map((_, i) => (
//                         <div key={i} className="flex items-center gap-3">
//                             <Skeleton className="h-5 w-5 rounded-full" />
//                             <div className="space-y-1">
//                                 <Skeleton className="h-3 w-16" />
//                                 <Skeleton className="h-4 w-24" />
//                             </div>
//                         </div>
//                     ))}
//                 </div>

//                 <div className="flex gap-3 pt-2">
//                     <Skeleton className="h-9 w-24 rounded-md" />
//                     <Skeleton className="h-9 w-24 rounded-md" />
//                 </div>
//             </CardContent>
//         </Card>
//     );
// };


export default Bookings;
