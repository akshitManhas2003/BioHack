/**
 * Error Handling Utilities
 * Provides standardized error handling, logging, and user-friendly messages
 */

// Error severity levels
export const ERROR_SEVERITY = {
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  CRITICAL: 'critical'
};

// Custom Error Classes
export class APIError extends Error {
  constructor(message, status, severity = ERROR_SEVERITY.ERROR, originalError = null) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.severity = severity;
    this.originalError = originalError;
    this.timestamp = new Date();
  }
}

export class ValidationError extends Error {
  constructor(message, field = null) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

export class NetworkError extends Error {
  constructor(message, originalError = null) {
    super(message);
    this.name = 'NetworkError';
    this.originalError = originalError;
  }
}

// Error handler class
export class ErrorHandler {
  static async handle(error, context = '') {
    const enhancedError = this.enhance(error, context);
    this.log(enhancedError);
    return enhancedError;
  }

  static enhance(error, context = '') {
    let enhancedError;

    if (error instanceof APIError) {
      enhancedError = error;
    } else if (error.response) {
      // Axios or fetch response error
      enhancedError = new APIError(
        this.getErrorMessage(error.response.status, error.response.data?.detail),
        error.response.status,
        this.getSeverityLevel(error.response.status),
        error
      );
    } else if (error.message?.includes('fetch') || error.message?.includes('Network')) {
      enhancedError = new NetworkError(
        'Network connection failed. Please check your internet connection.',
        error
      );
    } else if (error.name === 'TypeError') {
      enhancedError = new ValidationError(
        'Invalid data format received from server',
        'data'
      );
    } else {
      enhancedError = new APIError(
        error.message || 'An unexpected error occurred',
        500,
        ERROR_SEVERITY.ERROR,
        error
      );
    }

    enhancedError.context = context;
    return enhancedError;
  }

  static getErrorMessage(status, detail) {
    const messages = {
      400: detail || 'Invalid request. Please check your input.',
      401: 'Unauthorized. Please log in again.',
      403: 'Access denied. You do not have permission to perform this action.',
      404: 'Resource not found.',
      408: 'Request timeout. Please try again.',
      429: 'Too many requests. Please wait before trying again.',
      500: detail || 'Server error. Please try again later.',
      502: 'Bad gateway. The server is temporarily unavailable.',
      503: 'Service unavailable. Please try again later.',
      504: 'Gateway timeout. The server is not responding.'
    };

    return messages[status] || `Error ${status}: ${detail || 'An error occurred'}`;
  }

  static getSeverityLevel(status) {
    if (status >= 500) return ERROR_SEVERITY.CRITICAL;
    if (status >= 400) return ERROR_SEVERITY.ERROR;
    return ERROR_SEVERITY.WARNING;
  }

  static log(error) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      name: error.name,
      message: error.message,
      severity: error.severity || ERROR_SEVERITY.ERROR,
      status: error.status,
      context: error.context,
      stack: error.stack
    };

    console.error('[Error Log]', logEntry);

    // In production, send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      this.sendToTracking(logEntry);
    }
  }

  static sendToTracking(errorLog) {
    // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
    // fetch('/api/errors/log', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(errorLog)
    // });
  }
}

// API fetch wrapper with error handling
export async function fetchAPI(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new APIError(
        data.detail || `HTTP ${response.status}`,
        response.status,
        ErrorHandler.getSeverityLevel(response.status)
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof APIError) throw error;
    throw await ErrorHandler.handle(error, `fetchAPI: ${url}`);
  }
}

// Retry logic for failed requests
export async function retryFetch(url, options = {}, maxRetries = 3, delay = 1000) {
  let lastError;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fetchAPI(url, options);
    } catch (error) {
      lastError = error;

      // Don't retry on client errors (4xx)
      if (error.status && error.status >= 400 && error.status < 500) {
        throw error;
      }

      // Wait before retrying
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  }

  throw lastError;
}

// Get user-friendly error message
export function getUserFriendlyMessage(error) {
  if (error instanceof APIError) {
    return error.message;
  } else if (error instanceof NetworkError) {
    return 'Unable to connect to the server. Please check your internet connection.';
  } else if (error instanceof ValidationError) {
    return `Validation error: ${error.message}`;
  }
  return 'An unexpected error occurred. Please try again.';
}
