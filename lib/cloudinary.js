import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

/**
 * Upload file to Cloudinary (with fallback to local storage)
 * @param {Buffer} fileBuffer - ไฟล์ buffer
 * @param {String} filename - ชื่อไฟล์
 * @param {String} folder - folder ที่เก็บ (default: 'market-api/slips')
 * @returns {Promise<Object>} - Upload response
 */
export async function uploadToCloudinary(fileBuffer, filename, folder = 'market-api/slips') {
  try {
    // Try Cloudinary first
    return await new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'auto',
          public_id: `${Date.now()}-${filename}`,
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
              size: result.bytes,
              format: result.format,
              provider: 'cloudinary',
            });
          }
        }
      );

      upload.end(fileBuffer);
    });
  } catch (cloudinaryError) {
    console.warn('Cloudinary upload failed, falling back to local storage:', cloudinaryError.message);
    
    // Fallback to local file storage
    const timestamp = Date.now();
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    const localFilename = `${timestamp}-${sanitizedFilename}`;
    const localPath = path.join(uploadsDir, localFilename);
    
    fs.writeFileSync(localPath, fileBuffer);
    
    return {
      url: `/uploads/${localFilename}`,
      publicId: localFilename,
      size: fileBuffer.length,
      format: path.extname(filename).slice(1),
      provider: 'local',
      warning: 'Uploaded to local storage (Cloudinary unavailable)',
    };
  }
}

/**
 * Delete file from Cloudinary or local storage
 */
export async function deleteFromCloudinary(publicId, provider = 'cloudinary') {
  try {
    if (provider === 'local') {
      const localPath = path.join(uploadsDir, publicId);
      if (fs.existsSync(localPath)) {
        fs.unlinkSync(localPath);
        return { success: true, provider: 'local' };
      }
      return { success: false, message: 'File not found' };
    } else {
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
}

/**
 * Validate file
 */
export function validateFile(file) {
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'File size exceeds 5MB limit' };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: 'File type must be JPEG, PNG, or WebP' };
  }

  return { valid: true };
}
