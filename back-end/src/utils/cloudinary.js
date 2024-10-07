import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async avatarLocalPath => {
  try {
    if (!avatarLocalPath) {
      return null;
    }
    const response = await cloudinary.uploader.upload(avatarLocalPath, {
      resource_type: "auto",
      secure: true,
    });
    if (response) {
      fs.unlinkSync(avatarLocalPath);
    }

    return response;
  } catch (error) {
    if (fs.existsSync(avatarLocalPath)) {
      fs.unlinkSync(avatarLocalPath);
    }
    return null;
  }
};

const deleteFromCloudinary = async (imageUrl) => {
  try {
    if (!imageUrl) {
      return;
    }
    const publicId = imageUrl.split("/").pop().split(".")[0];
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
    });
    return result;
  } catch (error) {
    return null;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
