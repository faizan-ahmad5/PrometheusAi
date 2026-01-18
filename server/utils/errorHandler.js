// Centralized error handling

export class APIError extends Error {
  constructor(message, statusCode = 400, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

// Error codes for consistent error tracking
export const ErrorCodes = {
  // Authentication errors
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  TOKEN_EXPIRED: "TOKEN_EXPIRED",
  UNAUTHORIZED: "UNAUTHORIZED",

  // Validation errors
  INVALID_INPUT: "INVALID_INPUT",
  MISSING_FIELD: "MISSING_FIELD",

  // Resource errors
  NOT_FOUND: "NOT_FOUND",
  ALREADY_EXISTS: "ALREADY_EXISTS",

  // Business logic errors
  INSUFFICIENT_CREDITS: "INSUFFICIENT_CREDITS",
  RATE_LIMITED: "RATE_LIMITED",

  // Server errors
  DATABASE_ERROR: "DATABASE_ERROR",
  EXTERNAL_API_ERROR: "EXTERNAL_API_ERROR",
  INTERNAL_ERROR: "INTERNAL_ERROR",
};

// Error response formatter
export const formatErrorResponse = (error) => {
  if (error instanceof APIError) {
    return {
      success: false,
      message: error.message,
      code: error.code,
      details: error.details,
    };
  }

  // Handle unknown errors
  return {
    success: false,
    message: "An unexpected error occurred",
    code: ErrorCodes.INTERNAL_ERROR,
    ...(process.env.NODE_ENV === "development" && { debug: error.message }),
  };
};

// Async error wrapper to avoid try-catch in routes
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default {
  APIError,
  ErrorCodes,
  formatErrorResponse,
  asyncHandler,
};
