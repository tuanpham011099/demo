const cloudinary = require('cloudinary').v2;
require('dotenv').config();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadImg = async(path) => {
    try {
        let res = await cloudinary.uploader.upload(path);
        return res.secure_url;
    } catch (error) {
        return null;
    }
};

module.exports = uploadImg;