import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { verifyToken, getTokenFromHeader } from '@/lib/auth';
import { enableCORS, handleCORS } from '@/lib/cors';

export async function OPTIONS(request) {
  return handleCORS(request);
}

export async function GET(request) {
  await dbConnect();

  try {
    const bookings = await Booking.find({}).sort({ createdAt: -1 });
    const response = NextResponse.json(
      { success: true, data: bookings },
      { status: 200 }
    );
    return enableCORS(response);
  } catch (error) {
    const response = NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
    return enableCORS(response);
  }
}

export async function POST(request) {
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

  try {
    const body = await request.json();

    // ตรวจสอบค่าว่างต้องครบหรือไม่
    const requiredFields = ['storeName', 'ownerName', 'phone', 'email', 'shopType', 'stallNumber', 'bookingDate'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return Response.json(
          { success: false, error: `กรุณากรอก ${field}` },
          { status: 400 }
        );
      }
    }

    // เพิ่ม userId ถ้ามี token
    const bookingData = {
      ...body,
      ...(userId && { userId })
    };

    const booking = await Booking.create(bookingData);

    const response = NextResponse.json(
      { success: true, data: booking },
      { status: 201 }
    );
    return enableCORS(response);
  } catch (error) {
    const response = NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
    return enableCORS(response);
  }
}
