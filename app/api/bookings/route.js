import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { verifyToken, getTokenFromHeader } from '@/lib/auth';
import { enableCORS, handleCORS } from '@/lib/cors';
import { paginatedResponse, errorResponse, successResponse } from '@/lib/response';
import { logger } from '@/lib/logger';

export async function OPTIONS(request) {
  return handleCORS(request);
}

export async function GET(request) {
  const startTime = Date.now();
  
  try {
    await dbConnect();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const status = searchParams.get('status');
    const shopType = searchParams.get('shopType');
    const search = searchParams.get('search');

    // Build filter
    const filter = {};
    if (status) filter.status = status;
    if (shopType) filter.shopType = shopType;
    if (search) {
      filter.$or = [
        { storeName: { $regex: search, $options: 'i' } },
        { ownerName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    const total = await Booking.countDocuments(filter);
    const bookings = await Booking.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const duration = Date.now() - startTime;
    logger.api('GET', '/api/bookings', 200, duration);

    const response = paginatedResponse(bookings, total, page, limit);
    return enableCORS(response);
  } catch (error) {
    logger.error('GET /api/bookings', error);
    const response = errorResponse(error, 500);
    return enableCORS(response);
  }
}
export async function POST(request) {
  const startTime = Date.now();

  try {
    // Token เป็นตัวเลือก - ให้จองได้ทั้งกับ/ไม่มี Token
    const authHeader = request.headers.get('Authorization');
    const token = getTokenFromHeader(authHeader);
    let userId = null;

    if (token) {
      const decoded = verifyToken(token);
      if (decoded) {
        userId = decoded.userId;
      }
    }

    await dbConnect();
    const body = await request.json();

    // Validate input
    const { validateBookingData } = await import('@/lib/validation');
    const validation = validateBookingData(body);
    
    if (!validation.valid) {
      const response = NextResponse.json(
        { success: false, errors: validation.errors },
        { status: 400 }
      );
      return enableCORS(response);
    }

    // เพิ่ม userId ถ้ามี token
    const bookingData = {
      ...body,
      ...(userId && { userId })
    };

    const booking = await Booking.create(bookingData);

    logger.info(`Booking created: ${booking._id}`, { userId });

    const response = successResponse(booking, 'Booking created successfully', 201);
    return enableCORS(response);
  } catch (error) {
    logger.error('POST /api/bookings', error);
    const response = errorResponse(error, 400);
    return enableCORS(response);
  }
}
