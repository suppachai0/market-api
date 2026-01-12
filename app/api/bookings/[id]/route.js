import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { verifyToken, getTokenFromHeader } from '@/lib/auth';
import { enableCORS, handleCORS } from '@/lib/cors';

export async function OPTIONS(request) {
  return handleCORS(request);
}

export async function GET(request, { params }) {
  await dbConnect();

  try {
    const { id } = params;
    const booking = await Booking.findById(id);

    if (!booking) {
      const response = NextResponse.json(
        { success: false, error: 'ไม่พบการจองที่ขอ' },
        { status: 404 }
      );
      return enableCORS(response);
    }
    const response = NextResponse.json(
      { success: true, data: booking },
      { status: 200 }
    );
    return enableCORS(response);
  } catch (error) {
    const errorResponse = NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
    return enableCORS(errorResponse);
  }
}

export async function PUT(request, { params }) {
  // ตรวจสอบ Authentication
  const authHeader = request.headers.get('Authorization');
  const token = getTokenFromHeader(authHeader);

  if (!token) {
    const response = NextResponse.json(
      { success: false, error: 'Unauthorized - Missing token' },
      { status: 401 }
    );
    return enableCORS(response);
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    const response = NextResponse.json(
      { success: false, error: 'Unauthorized - Invalid token' },
      { status: 401 }
    );
    return enableCORS(response);
  }

  await dbConnect();

  try {
    const { id } = params;
    const body = await request.json();

    const booking = await Booking.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!booking) {
      const response = NextResponse.json(
        { success: false, error: 'ไม่พบการจองที่ขอ' },
        { status: 404 }
      );
      return enableCORS(response);
    }

    const response = NextResponse.json(
      { success: true, data: booking },
      { status: 200 }
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

export async function DELETE(request, { params }) {
  // ตรวจสอบ Authentication
  const authHeader = request.headers.get('Authorization');
  const token = getTokenFromHeader(authHeader);

  if (!token) {
    const response = NextResponse.json(
      { success: false, error: 'Unauthorized - Missing token' },
      { status: 401 }
    );
    return enableCORS(response);
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    const response = NextResponse.json(
      { success: false, error: 'Unauthorized - Invalid token' },
      { status: 401 }
    );
    return enableCORS(response);
  }

  await dbConnect();

  try {
    const { id } = params;
    const booking = await Booking.findByIdAndDelete(id);

    if (!booking) {
      const response = NextResponse.json(
        { success: false, error: 'ไม่พบการจองที่ขอ' },
        { status: 404 }
      );
      return enableCORS(response);
    }

    const response = NextResponse.json(
      { success: true, message: 'ลบการจองสำเร็จ' },
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
