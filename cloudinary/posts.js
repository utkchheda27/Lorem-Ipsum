import cloudinary from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary"
import dotenv from "dotenv"
dotenv.config()

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary.v2,
    params: {
        folder: "VJTI's social media app Test/posts",
        allowedFormats: ["jpeg", "png", "jpg", 'webp'],
    },
});

export { storage, cloudinary };