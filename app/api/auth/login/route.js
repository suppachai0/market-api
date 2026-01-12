import { NextResponse } from 'next/server';
import { generateToken } from '@/lib/auth';
import { enableCORS, handleCORS } from '@/lib/cors';

export async function OPTIONS(request) {
  return handleCORS(request);
}

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // ตรวจสอบ credentials
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // สร้าง JWT token
    const token = generateToken(email);

    const response = NextResponse.json(
      {
        success: true,
        data: {
          token,
          user: { email },
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
