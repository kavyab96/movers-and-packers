import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useEffect,useState } from "react";
import { toast } from "sonner";
import { verifyPayment } from "../../services/paymentService";

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
                // await axios.post("/api/payment/verify-payment", {
                //     session_id,
                //     payment_id,
                // });
                const res = await verifyPayment({session_id});
                setPaymentId(res.data.payment.service_request_id.booking_id);
                
                

                // toast.success("Payment Successful!");
                // navigate("/user/bookings");
            } catch (err) {
                // console.error(err);
                toast.error("Payment verification failed");
            }
        };

        checkPayment();
    }, []);

    // const bookingId = params.get("bookingId");

    return (
        <div className="flex justify-center mt-20 px-4">
            <Card className="w-full max-w-lg shadow-lg border rounded-xl">
                <CardHeader className="text-center">
                    <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-2" />
                    <CardTitle className="text-3xl font-bold text-green-600">
                        Payment Successful!
                    </CardTitle>
                </CardHeader>

                <CardContent className="text-center space-y-6">

                    <p className="text-muted-foreground text-lg">
                        Thank you! Your payment was processed successfully.
                    </p>
 
                    {paymentId && (
                        <p className="font-medium text-lg">
                            Booking ID: <span className="text-primary">{paymentId}</span>
                        </p>
                    )} 

                    <Button
                        className="w-full py-5 text-lg"
                        onClick={() => navigate("/user/bookings")}
                    >
                        Go to My Bookings
                    </Button>

                    {/* <Button
                        variant="secondary"
                        className="w-full py-5 text-lg"
                        onClick={() => navigate(`/user/payment/${paymentId}`)}
                    >
                        View Receipt
                    </Button> */}
                </CardContent>
            </Card>
        </div>
    );
};

export default PaymentSuccess;
