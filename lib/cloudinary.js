import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload file to Cloudinary
 * @param {Buffer} fileBuffer - ไฟล์ buffer
 * @param {String} filename - ชื่อไฟล์
 * @param {String} folder - folder ที่เก็บ (default: 'market-api/slips')
 * @returns {Promise<Object>} - Cloudinary upload response
 */
export async function uploadToCloudinary(fileBuffer, filename, folder = 'market-api/slips') {
  return new Promise((resolve, reject) => {
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
          });
        }
      }
    );

    upload.end(fileBuffer);
  });
}

/**
 * Delete file from Cloudinary
 */
export async function deleteFromCloudinary(publicId) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
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
