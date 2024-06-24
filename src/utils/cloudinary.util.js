import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv'
dotenv.config()


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_API_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

const uploadImageOnCloudinary = async (filePath) => {
    try {
        if (!filePath) {
            return "file path not found"
        }
        const response = await cloudinary.uploader.upload(filePath, {
            resource_type: "auto"
        })
        return response

    } catch (error) {
        if (error) {
            console.log(error)
        }
    }
}

export { uploadImageOnCloudinary }
