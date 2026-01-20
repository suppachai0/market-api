import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

export function generateToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '24h' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export function getTokenFromHeader(authHeader) {
  if (!authHeader) return null;
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
  return parts[1];
}

/**
 * Middleware: ตรวจสอบ JWT token
 * ใช้สำหรับ protected routes
 */
export function requireAuth(request) {
  const authHeader = request.headers.get('Authorization');
  const token = getTokenFromHeader(authHeader);

  if (!token) {
    return {
      authenticated: false,
      error: 'Missing authentication token',
      statusCode: 401,
    };
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return {
      authenticated: false,
      error: 'Invalid or expired token',
      statusCode: 401,
    };
  }

  return {
    authenticated: true,
    userId: decoded.userId,
  };
}

/**
 * Middleware: ตรวจสอบ Admin
 */
export function requireAdmin(request) {
  const auth = requireAuth(request);
  
  if (!auth.authenticated) {
    return auth;
  }

  // ตรวจสอบว่าเป็น admin (เก็บ userId ที่เป็น email ของ admin)
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  if (auth.userId !== adminEmail) {
    return {
      authenticated: false,
      error: 'Admin access required',
      statusCode: 403,
    };
  }

  return {
    authenticated: true,
    isAdmin: true,
    userId: auth.userId,
  };
}
