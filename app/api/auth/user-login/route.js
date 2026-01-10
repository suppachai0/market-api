import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';
import { generateToken } from '../../../lib/auth';

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

    // หา user ด้วย email
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // ตรวจสอบ password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

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
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
