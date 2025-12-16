import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { verifyPayment } from "../../services/paymentService";

import { motion } from "framer-motion";
import confetti from "canvas-confetti";

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const [paymentId, setPaymentId] = useState(null);


    useEffect(() => {
        const checkPayment = async () => {
            const session_id = params.get("session_id");
            // const payment_id = params.get("payment_id");
            if (!session_id) {
                return alert("Invalid payment details");
            }

            try {
                const res = await verifyPayment({ session_id });
                setPaymentId(res.data.payment.service_request_id.booking_id);

                // CONFETTI BURST-----------------------
                const colors = ['#F5BB27', '#76F527']

                //center burst
                confetti({
                    particleCount: 200,
                    spread: 150,
                    origin: { x: 0.4, y: 0.2 }
                })
                // left side 
                confetti({
                    particleCount: 100,
                    spread: 50,
                    angle: 70,
                    origin: { x: 0 }
                })
                //right side
                confetti({
                    particleCount: 100,
                    spread: 70,
                    angle: 130,
                    origin: { x: 1 }
                })
                const interval = setInterval(() => {
                    confetti({
                        particleCount: 50,
                        spread: 130,
                        origin: { x: Math.random(), y: 0.6 }
                    });
                }, 2000)
                const stop = setTimeout(() => clearInterval(interval), 5000);

                return () => {
                    clearInterval(interval);
                    clearTimeout(stop);
                };

            } catch (err) {
                toast.error("Payment verification failed");
            }
        };

        checkPayment();
    }, []);

    // return (
    //     <div className="flex justify-center mt-20 px-4 ">
    //         <Card className="w-full max-w-lg shadow-lg border rounded-xl dark:bg-gray-600">
    //             <CardHeader className="text-center">
    //                 <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-2" />
    //                 <CardTitle className="text-3xl font-bold text-green-600">
    //                     Payment Successful!
    //                 </CardTitle>
    //             </CardHeader>

    //             <CardContent className="text-center space-y-6">

    //                 <p className="text-muted-foreground text-lg">
    //                     Thank you! Your payment was processed successfully.
    //                 </p>

    //                 {paymentId && (
    //                     <p className="font-medium text-lg">
    //                         Booking ID: <span className="text-primary">{paymentId}</span>
    //                     </p>
    //                 )}

    //                 <Button
    //                     className="w-full py-5 text-lg"
    //                     onClick={() => navigate("/user/bookings")}
    //                 >
    //                     Go to My Bookings
    //                 </Button>

    //             </CardContent>
    //         </Card>
    //     </div>
    // );

    return (
        
        <div className="min-h-[70vh] flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-md"
            >
                <Card className="
                    relative overflow-hidden
                    rounded-2xl border
                    bg-background/80 backdrop-blur
                    shadow-xl
                ">
                    {/* Gradient top accent */}
                    {/* <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-green-100 via-emerald-200 to-sky-300" /> */}

                    <CardHeader className="text-center pt-10 space-y-4">
                        {/* Animated success ring */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 180, damping: 12 }}
                            className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10"
                        >
                            <CheckCircle className="h-12 w-12 text-green-600" />
                        </motion.div>

                        <CardTitle className="text-2xl font-semibold tracking-tight text-green-600">
                            Payment Successful
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="px-8 pb-8 text-center space-y-6">
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-muted-foreground"
                        >
                            Your payment has been confirmed and your booking is now active.
                        </motion.p>

                        {paymentId && (
                            <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="rounded-lg bg-muted px-4 py-3 text-sm"
                            >
                                <span className="text-muted-foreground">Booking ID</span>
                                <div className="font-semibold tracking-wide text-primary">
                                    {paymentId}
                                </div>
                            </motion.div>
                        )}

                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <Button
                                size="lg"
                                className="
                                    w-full rounded-xl
                                    bg-primary text-primary-foreground
                                    hover:scale-[1.02] transition-transform
                                "
                                onClick={() => navigate("/user/bookings")}
                            >
                                Go to My Bookings
                            </Button>
                        </motion.div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>

    );

};

export default PaymentSuccess;
