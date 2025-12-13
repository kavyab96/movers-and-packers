

import Stripe from "stripe";
import Payment from "../Models/paymentModel.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);



const getPayments = async (req, res, next) => {
    try {
        const { page = 1, limit = 2, date } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        const providerId = req.user._id;

        // Base filter (for client)
        const filter = {
            paid_to: providerId,
            is_active: true
        };

        // Date filter(single day)
        if (date) {
            const selectedDate = new Date(date);
            const start = new Date(selectedDate);
            start.setHours(0, 0, 0, 0);

            const end = new Date(selectedDate);
            end.setHours(23, 59, 59, 999);

            filter.created_at = { $gte: start, $lte: end };
        }

        /*---------total count----------*/
        const total = await Payment.countDocuments(filter);

        /* ---------------- TOTAL EARNINGS (SUM) starts---------------- */
        const earningsResult = await Payment.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: null,
                    totalEarnings: { $sum: "$amount" },
                },
            },
        ]);
        const totalEarnings = earningsResult[0]?.totalEarnings || 0;
        /* ---------------- TOTAL EARNINGS (SUM) ends ---------------- */

        /* ---------------- PAGINATED PAYMENTS ---------------- */
        const payments = await Payment.find(filter)
            .select(" amount payment_status payment_date created_at paid_by service_request_id ")
            .populate("paid_by", "name email")
            .populate("service_request_id", "booking_id")
            .sort({ created_at: -1 })
            .skip(skip)
            .limit(limitNum);

        /* ---------------- RESPONSE ---------------- */
        return res.status(200).json({
            message: "Assigned earnings fetched successfully.",
            total,
            currentPage: pageNum,
            totalPages: Math.ceil(total / limitNum),
            data: payments,
            totalEarnings
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


export { getPayments, createStripeSession, verifyPayment };