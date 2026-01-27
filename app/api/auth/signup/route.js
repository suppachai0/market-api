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
    const { username, email, password, fullName } = await req.json();

    // ตรวจสอบข้อมูล
    if (!username || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Please provide username, email, and password' },
        { status: 400 }
      );
    }

    // ตรวจสอบ username หรือ email มีอยู่แล้วหรือไม่
    const existingUser = await User.findOne({
      $or: [{ username }, { email: email.trim() }]
    });

    if (existingUser) {
      const response = NextResponse.json(
        { success: false, error: 'Username or email already exists' },
        { status: 400 }
      );
      return enableCORS(response);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // สร้าง user ใหม่
    const user = await User.create({
      username,
      email: email.trim(),
      password: hashedPassword,
      fullName: fullName || username
    });

    // สร้าง token
    const token = generateToken(user._id.toString());

    return NextResponse.json(
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
      { status: 201 }
    );
    return enableCORS(response);
  } catch (error) {
    console.error('Signup error:', error);
    const response = NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
    return enableCORS(response);
  }
}
