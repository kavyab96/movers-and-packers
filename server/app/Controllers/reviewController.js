
import ServiceRequest from "../Models/serviceRequestModel.js";
import Review from "../Models/reviewModel.js";

export const addReview = async (req, res, next) => {
    try {
        const providerId = req.params.providerId;
        const clientId = req.user._id;
        const { service_request_id, rating, review_text } = req.body;


        //  Check if the service request exists and belongs to this client and provider
        const serviceRequest = await ServiceRequest.findById(service_request_id);
        if (
            !serviceRequest ||
            serviceRequest.client_id.toString() !== clientId.toString() ||
            serviceRequest.provider_id.toString() !== providerId.toString()
        ) {
            return res.status(404).json({
                message: "Service request not found for this client and provider.",
            });
        }
        //  Check if the service request is completed
        if (serviceRequest.status !== "completed") {
            return res.status(400).json({
                message: "Cannot review a service request that is not completed.",
            });
        }

         //  Check if review already exists for this booking
        const existingReview = await Review.findOne({
            service_request_id,
            reviewer_id: clientId,
        });
        if (existingReview) {
            return res.status(400).json({
                message: "You have already reviewed this service request.",
            });
        }


        //  Create the review
        const review = await Review.create({
            service_request_id,
            reviewer_id: clientId,
            reviewed_entity_id: providerId,
            rating,
            review_text: review_text || null,
            updated_by: clientId,
        });

        return res.status(201).json({
            message: "Review added successfully.",
            data: review,
        });

    } catch (error) {
        next(error);
    }
}