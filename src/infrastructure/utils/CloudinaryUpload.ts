import cloudinary from "../config/cloudinary";
import fs from 'fs';
import path from 'path';

class CloudinaryUpload {
    async upload(filePath: string, folder: string) {
        const extension = path.extname(filePath).toLowerCase();
        const isPDF = ['.pdf'].includes(extension);

        const uploadOptions: Record<string, any> = { folder: folder };

        if (isPDF) {
            // If it's a PDF file, set resource_type to 'raw'
            uploadOptions.resource_type = 'raw';
            console.log("**************************************************************");
            
        }

        const result = await cloudinary.uploader.upload(filePath, uploadOptions);

        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('Error deleting file:', err);
            }
        });

        return result;
    }
}

export default CloudinaryUpload;
