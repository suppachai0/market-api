import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { verifyToken, getTokenFromHeader } from '@/lib/auth';

export async function GET(request, { params }) {
  await dbConnect();

  try {
    const { id } = params;
    const booking = await Booking.findById(id);

    if (!booking) {
      return Response.json(
        { success: false, error: 'ไม่พบการจองที่ขอ' },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, data: booking },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  // ตรวจสอบ Authentication
  const authHeader = request.headers.get('Authorization');
  const token = getTokenFromHeader(authHeader);

  if (!token) {
    return Response.json(
      { success: false, error: 'Unauthorized - Missing token' },
      { status: 401 }
    );
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return Response.json(
      { success: false, error: 'Unauthorized - Invalid token' },
      { status: 401 }
    );
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
      return Response.json(
        { success: false, error: 'ไม่พบการจองที่ขอ' },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, data: booking },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

export async function DELETE(request, { params }) {
  // ตรวจสอบ Authentication
  const authHeader = request.headers.get('Authorization');
  const token = getTokenFromHeader(authHeader);

  if (!token) {
    return Response.json(
      { success: false, error: 'Unauthorized - Missing token' },
      { status: 401 }
    );
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return Response.json(
      { success: false, error: 'Unauthorized - Invalid token' },
      { status: 401 }
    );
  }

  await dbConnect();

  try {
    const { id } = params;
    const booking = await Booking.findByIdAndDelete(id);

    if (!booking) {
      return Response.json(
        { success: false, error: 'ไม่พบการจองที่ขอ' },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, message: 'ลบการจองสำเร็จ' },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
