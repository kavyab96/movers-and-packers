import KycDocumentDb from "../Models/kycDocumentModel.js";
import uploadToCloudinary from "../Utilities/imageUpload.js";
import User from "../Models/userModel.js";



/* View uploaded KYC documents by provider */
export const getKycDocuments = async (req, res, next) => {
    try {

        const providerId = req.user._id;
       
        // Fetch provider
        const provider = await User.findById(providerId).select("kyc_documents");
        if (!provider) {
            return res.status(404).json({
                message: "Provider not found."
            });
        }
      
        //convert providerId to string for matching
        const providerIdStr = providerId.toString();
        
        const filter = { is_active: true,user_id: providerIdStr};
        const kyc_documents = await KycDocumentDb.find(filter);      

        return res.status(200).json({
            message: "KYC documents fetched successfully.",
            data: kyc_documents,
            user:providerId
        });
    } catch (error) {
        next(error);
    }
}

/* Upload or update KYC documents by provider */
export const uploadKycDocuments = async (req, res, next) => {
    try {
        const providerId = req.user._id;

        const { document_type } = req.body;
          
       
        // Allowed document types
        const allowedDocs = ["aadhar", "pan", "license", "voter_id", "passport", "other"];
        //validation
        if (!document_type) {
            return res.status(400).json({
                message: "document_type is required."
            });
        }
        if (!allowedDocs.includes(document_type.toLowerCase())) {
            return res.status(400).json({
                message: `Invalid document_type. Allowed types are: ${allowedDocs.join(", ")}`,
            });
        }
        

        //  File check
        if (!req.file) {
            return res.status(400).json({
                message: "KYC document file is required."
            });
        }

        //verify provider exists
        const provider = await User.findById(providerId);
        if (!provider) {
            return res.status(404).json({
                message: "Provider not found."
            });
        }

        // Upload document to cloudinary       
        const cloudinaryRes = await uploadToCloudinary(req.file.path, 'kyc_doc');

        const newDoc = new KycDocumentDb({
            user_id: providerId,
            document_type,
            file_url: cloudinaryRes,
            status: "pending",
            updated_by: providerId
        })
        const saved = await newDoc.save();
        if (saved) {
            return res.status(201).json({
                message: "Doccument uploaded successfully",
                data: saved
            });
        }


    } catch (error) {
        next(error);
    }
}

