import { NextResponse } from 'next/server';

/**
 * Standardized API Response Structure
 * ทุก API endpoint ควรใช้ format นี้
 */

export function successResponse(data, message = null, statusCode = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
      ...(message && { message }),
    },
    { status: statusCode }
  );
}

export function errorResponse(error, statusCode = 500) {
  // ป้องกันการส่ง error details ที่ละเอียดมากเกินไป
  const isProduction = process.env.NODE_ENV === 'production';

  return NextResponse.json(
    {
      success: false,
      error: {
        message: error.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
      },
    },
    { status: statusCode }
  );
}

export function paginatedResponse(data, total, page, limit, message = null) {
  const totalPages = Math.ceil(total / limit);

  return NextResponse.json(
    {
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      ...(message && { message }),
    },
    { status: 200 }
  );
}

/**
 * Error Types
 */
export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
  }
}

export class AuthenticationError extends Error {
  constructor(message = 'Unauthorized') {
    super(message);
    this.name = 'AuthenticationError';
    this.statusCode = 401;
  }
}

export class AuthorizationError extends Error {
  constructor(message = 'Forbidden') {
    super(message);
    this.name = 'AuthorizationError';
    this.statusCode = 403;
  }
}

export class NotFoundError extends Error {
  constructor(message = 'Resource not found') {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}
