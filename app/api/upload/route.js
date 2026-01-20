import { NextResponse } from 'next/server';
import { uploadToCloudinary, validateFile } from '@/lib/cloudinary';
import { enableCORS, handleCORS } from '@/lib/cors';
import { successResponse, errorResponse } from '@/lib/response';
import { logger } from '@/lib/logger';

export async function OPTIONS(request) {
  return handleCORS(request);
}

/**
 * POST /api/upload
 * Upload file to Cloudinary
 * 
 * Expected: multipart/form-data with 'file' field
 * 
 * Example:
 * const formData = new FormData();
 * formData.append('file', fileInput.files[0]);
 * fetch('/api/upload', { method: 'POST', body: formData })
 */
export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      const response = errorResponse(
        { message: 'No file provided' },
        400
      );
      return enableCORS(response);
    }

    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      const response = errorResponse(
        { message: validation.error },
        400
      );
      return enableCORS(response);
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(buffer, file.name);

    logger.info('File uploaded successfully', { url: uploadResult.url });

    const response = successResponse(
      {
        url: uploadResult.url,
        publicId: uploadResult.publicId,
        size: uploadResult.size,
        format: uploadResult.format,
      },
      'File uploaded successfully',
      200
    );
    return enableCORS(response);
  } catch (error) {
    logger.error('Upload error:', error);
    const response = errorResponse(error, 500);
    return enableCORS(response);
  }
}
