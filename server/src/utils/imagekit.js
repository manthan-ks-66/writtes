import ImageKit from "imagekit";
import { ApiError } from "./ApiError.js";
import fs from "fs";

const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_API_KEY,
  publicKey: process.env.IMAGEKIT_PUBLIC_API_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_END_POINT,
});

const uploadToImageKit = async (filePath, fileName, folderName) => {
  try {
    if (!filePath || !fileName) return null;

    const readableFile = fs.createReadStream(filePath);
    const res = await imagekit.upload({
      folder: folderName,
      file: readableFile,
      fileName: fileName,
    });

    return res;
  } catch (error) {
    throw new ApiError(500, "File upload failed");
  } finally {
    try {
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
      }
    } catch (error) {
      console.log("Local file clean-up failed\n", error.message);
    }
  }
};

const deleteImageKitFile = async (fileId) => {
  try {
    await imagekit.deleteFile(fileId);
  } catch (error) {
    throw new ApiError(500, "Imagekit file deletion failed");
  }
};

export { uploadToImageKit, deleteImageKitFile };
