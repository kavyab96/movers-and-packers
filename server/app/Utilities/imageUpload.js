const cloudinary = require("../../config/cloudinaryConfig");

const uploadToCloudinary =   (filePath,folderName) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(filePath,
             { folder:`movers-and-packers/${folderName}` },
             (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result.secure_url);
                }
        });
    });
}

module.exports =  uploadToCloudinary ;