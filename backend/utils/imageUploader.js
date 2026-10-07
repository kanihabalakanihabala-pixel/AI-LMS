const cloudinary = require("cloudinary").v2;

const CLOUDINARY_UPLOAD_TIMEOUT = 10 * 60 * 1000;
const CLOUDINARY_CHUNK_SIZE = 6 * 1024 * 1024;

exports.uploadImageToCloudinary = async (
  file,
  folder,
  height,
  quality
) => {
  const options = {
    folder,
    timeout: CLOUDINARY_UPLOAD_TIMEOUT,
  };

  if (height) {
    options.height = height;
  }

  if (quality) {
    options.quality = quality;
  }

  const isVideo =
    file.mimetype && file.mimetype.startsWith("video/");

  // VIDEO UPLOAD
  if (isVideo) {
    options.resource_type = "video";
    options.chunk_size = CLOUDINARY_CHUNK_SIZE;

    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_large(
        file.tempFilePath,
        options,
        (error, result) => {
          if (error) {
            console.error("Cloudinary video upload error:", error);
            reject(error);
          } else {
            console.log("Cloudinary video upload successful");
            console.log("Video URL:", result.secure_url);
            console.log("Video duration:", result.duration);

            resolve(result);
          }
        }
      );
    });
  }

  // IMAGE UPLOAD
  options.resource_type = "auto";

  return await cloudinary.uploader.upload(
    file.tempFilePath,
    options
  );
};