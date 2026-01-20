/**
 * Input Validation Utilities
 */

const VALIDATION_RULES = {
  phone: {
    pattern: /^0[0-9]{9}$/,
    message: 'Phone must be 10 digits starting with 0',
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Invalid email format',
  },
  stallNumber: {
    pattern: /^[A-Z]-\d{2}$/,
    message: 'Stall number must be format: A-01',
  },
  shopType: {
    values: ['food', 'clothing', 'goods', 'other'],
    message: 'Shop type must be: food, clothing, goods, or other',
  },
  bookingStatus: {
    values: ['pending', 'approved', 'rejected'],
    message: 'Status must be: pending, approved, or rejected',
  },
};

/**
 * Validate individual field
 */
export function validateField(fieldName, value, rules = VALIDATION_RULES[fieldName]) {
  if (!rules) {
    return { valid: true };
  }

  // Check required
  if (!value && typeof value !== 'number') {
    return { valid: false, error: `${fieldName} is required` };
  }

  // Pattern validation
  if (rules.pattern && !rules.pattern.test(value)) {
    return { valid: false, error: rules.message };
  }

  // Enum validation
  if (rules.values && !rules.values.includes(value)) {
    return { valid: false, error: rules.message };
  }

  return { valid: true };
}

/**
 * Validate booking data
 */
export function validateBookingData(data) {
  const errors = {};
  const requiredFields = ['storeName', 'ownerName', 'phone', 'email', 'shopType', 'stallNumber', 'bookingDate'];

  requiredFields.forEach(field => {
    if (!data[field]) {
      errors[field] = `${field} is required`;
    }
  });

  // Validate specific fields
  if (data.phone) {
    const phoneValidation = validateField('phone', data.phone);
    if (!phoneValidation.valid) {
      errors.phone = phoneValidation.error;
    }
  }

  if (data.email) {
    const emailValidation = validateField('email', data.email);
    if (!emailValidation.valid) {
      errors.email = emailValidation.error;
    }
  }

  if (data.shopType) {
    const shopTypeValidation = validateField('shopType', data.shopType);
    if (!shopTypeValidation.valid) {
      errors.shopType = shopTypeValidation.error;
    }
  }

  if (data.stallNumber) {
    const stallValidation = validateField('stallNumber', data.stallNumber);
    if (!stallValidation.valid) {
      errors.stallNumber = stallValidation.error;
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors: Object.keys(errors).length > 0 ? errors : null,
  };
}

/**
 * Validate auth data
 */
export function validateAuthData(data, type = 'login') {
  const errors = {};

  if (type === 'login') {
    if (!data.email) errors.email = 'Email is required';
    if (!data.password) errors.password = 'Password is required';

    if (data.email) {
      const emailValidation = validateField('email', data.email);
      if (!emailValidation.valid) {
        errors.email = emailValidation.error;
      }
    }
  }

  if (type === 'signup') {
    if (!data.username) errors.username = 'Username is required';
    if (!data.email) errors.email = 'Email is required';
    if (!data.password) errors.password = 'Password is required';
    if (!data.fullName) errors.fullName = 'Full name is required';

    if (data.email) {
      const emailValidation = validateField('email', data.email);
      if (!emailValidation.valid) {
        errors.email = emailValidation.error;
      }
    }

    if (data.password && data.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors: Object.keys(errors).length > 0 ? errors : null,
  };
}
