

import Stripe from "stripe";
import Payment from "../Models/paymentModel.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);



const getPayments = async (req, res, next) => {
    try {

        return res.status(200).json({
            message: "Provider earnings fetched successfully.",
        });
    } catch (error) {
        next(error);
    }
}


const createStripeSession = async (req, res, next) => {
    try {
        const { payment_id } = req.body;
        if (!payment_id) return res.status(400).json({ error: "payment_id required" });

        const payment = await Payment.findById(payment_id)
            .populate("paid_by", "_id email")
            .populate("service_request_id", "_id booking_id");
        if (!payment) return res.status(404).json({ error: "Payment not found" });

        // Add useful metadata to map session -> payment
        const metadata = {
            payment_id: payment._id.toString(),
            service_request_id: payment.service_request_id.toString(),
            paid_by: payment.paid_by?._id?.toString() ?? ""
        };

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: `Service Payment (${payment.service_request_id})`,
                        },
                        unit_amount: Math.round(payment.amount * 100), // amount in paise
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            metadata: metadata,
            success_url: `${process.env.FRONTEND_URL}/user/payment-success?session_id={CHECKOUT_SESSION_ID}`,//&payment_id=${payment._id}
            cancel_url: `${process.env.FRONTEND_URL}/user/payment-failed`
            // 'https://your-frontend-url.com/cancel',
        });


        // Optionally save stripe session id to payment record for quick lookup
        payment.payment_gateway = "Stripe";
        payment.invoice_link = session.url; // optional
        await payment.save();

        return res.status(200).json({
            // url: "https://stripe.com/checkout-session-url", // Placeholder URL
            success: true,
            url: session.url,
            session_id: session.id
        });


    } catch (error) {
        next(error);
    }
};

/* Verify payment after checkout */
const verifyPayment = async (req, res, next) => {
    try {
        const { session_id } = req.body;
        if (!session_id) return res.status(400).json({ error: "session_id required" }); 

        const session = await stripe.checkout.sessions.retrieve(session_id);
        if (!session) return res.status(404).json({ error: "Session not found" });

        if (session.payment_status !== "paid") {
            return res.status(400).json({ error: "Payment not completed" });
        }   

        
        // Retrieve metadata
        const { payment_id } = session.metadata;
        if (!payment_id) return res.status(400).json({ error: "Invalid session metadata" });

        const payment = await Payment.findById(payment_id)
        .populate("service_request_id", "_id booking_id");
        if (!payment) return res.status(404).json({ error: "Payment record not found" });   
       
        // Update payment fields
        payment.payment_status = "completed";
        payment.payment_date = new Date();
        await payment.save();
        return res.status(200).json({
            message: "Payment verified successfully",
            payment: payment
        });;
    } catch (error) {
        next(error);
    }   
};


export { getPayments, createStripeSession ,verifyPayment};