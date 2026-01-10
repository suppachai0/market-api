import { NextResponse } from 'next/server';
import { generateToken } from '../../../lib/auth';

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    // ตรวจสอบ credentials
    const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // สร้าง JWT token
    const token = generateToken(username);

    return NextResponse.json(
      {
        success: true,
        data: {
          token,
          user: { username },
          expiresIn: '24h'
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Login failed' },
      { status: 500 }
    );
  }
}
