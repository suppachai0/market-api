/**
 * Simple Logger for API requests/errors
 */

const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

const CURRENT_LEVEL = LOG_LEVELS.INFO;

function formatTimestamp() {
  return new Date().toISOString();
}

function shouldLog(level) {
  return level >= CURRENT_LEVEL;
}

export const logger = {
  debug: (message, data = null) => {
    if (shouldLog(LOG_LEVELS.DEBUG)) {
      console.log(`[${formatTimestamp()}] DEBUG: ${message}`, data || '');
    }
  },

  info: (message, data = null) => {
    if (shouldLog(LOG_LEVELS.INFO)) {
      console.log(`[${formatTimestamp()}] INFO: ${message}`, data || '');
    }
  },

  warn: (message, data = null) => {
    if (shouldLog(LOG_LEVELS.WARN)) {
      console.warn(`[${formatTimestamp()}] WARN: ${message}`, data || '');
    }
  },

  error: (message, error = null) => {
    if (shouldLog(LOG_LEVELS.ERROR)) {
      console.error(`[${formatTimestamp()}] ERROR: ${message}`, error || '');
    }
  },

  api: (method, path, statusCode, duration) => {
    const statusType = statusCode >= 400 ? 'ERROR' : 'INFO';
    console.log(
      `[${formatTimestamp()}] ${statusType}: ${method} ${path} - ${statusCode} (${duration}ms)`
    );
  },
};

export default logger;
