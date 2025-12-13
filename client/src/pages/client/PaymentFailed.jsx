import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

const PaymentFailed = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  // Stripe will send ?bookingId=xxxx or ?session_id=xxxx
  const bookingId = params.get("bookingId");

  const handleRetry = () => {
    if (bookingId) {
      navigate(`/user/payment/${bookingId}`);
    } else {
      navigate("/user/bookings");
    }
  };

  return (
    <div className="flex justify-center mt-20 px-4">
      <Card className="w-full max-w-lg shadow-lg border rounded-xl">
        <CardHeader className="text-center">
          <XCircle className="w-16 h-16 text-red-600 mx-auto mb-2" />
          <CardTitle className="text-2xl font-bold text-red-600">
            Payment Failed
          </CardTitle>
        </CardHeader>

        <CardContent className="text-center space-y-6">
          <p className="text-muted-foreground">
            Your payment could not be processed. Please try again.
          </p>

          <Button onClick={handleRetry} className="w-full py-5 text-lg">
            Retry Payment
          </Button>

          <Button
            variant="ghost"
            className="w-full"
            onClick={() => navigate("/user/bookings")}
          >
            Back to Bookings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentFailed;
