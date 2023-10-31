import cloudinary from "../config/cloudinary";
import fs from 'fs'

class CloudinaryUpload {
    async upload(filePath: string, folder: string) {
        const result = await cloudinary.uploader.upload(filePath, { folder: folder });
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('Error deleting file:', err);
            }
        });
        return result;
    }
}
export default CloudinaryUpload;