import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { generateToken } from '@/lib/auth';
import { enableCORS, handleCORS } from '@/lib/cors';

export async function OPTIONS(request) {
  return handleCORS(request);
}

export async function POST(req) {
  await dbConnect();

  try {
    const { email, password } = await req.json();

    // ตรวจสอบข้อมูล
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Please provide email and password' },
        { status: 400 }
      );
    }

    // ค้นหาผู้ใช้จาก MongoDB
    const user = await User.findOne({ email: email.trim() });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // ตรวจสอบรหัสผ่าน
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // สร้าง JWT token
    const token = generateToken(user._id.toString());

    const response = NextResponse.json(
      {
        success: true,
        data: {
          token,
          user: {
            _id: user._id,
            username: user.username,
            email: user.email,
            fullName: user.fullName
          },
          expiresIn: '24h'
        }
      },
      { status: 200 }
    );
    return enableCORS(response);
  } catch (error) {
    console.error('Login error:', error);
    const response = NextResponse.json(
      { success: false, error: 'Login failed' },
      { status: 500 }
    );
    return enableCORS(response);
  }
}
