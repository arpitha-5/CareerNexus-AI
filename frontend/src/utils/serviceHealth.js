/**
 * Service Health Check Utility
 * 
 * Monitors Flask CareerNexus AI service availability
 * Provides automatic retry logic and status updates
 * 
 * Usage:
 * const { isHealthy, error, retry } = useServiceHealth();
 */

/**
 * Check if Flask service is running
 * @param {string} serviceUrl - Base URL of Flask service (default: http://localhost:5002)
 * @param {number} timeout - Request timeout in ms (default: 3000)
 * @returns {Promise<{healthy: boolean, status: object|null, error: string|null}>}
 */
export async function checkServiceHealth(
  serviceUrl = 'http://localhost:5002',
  timeout = 3000
) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(`${serviceUrl}/api/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      mode: 'cors',
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Health check failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Validate response structure
    if (data.status !== 'ok') {
      throw new Error('Service returned unhealthy status');
    }

    return {
      healthy: true,
      status: data,
      error: null,
    };
  } catch (error) {
    // Distinguish between network errors and timeout
    let errorMessage = error.message;

    if (error.name === 'AbortError') {
      errorMessage = 'Service health check timeout - Flask service is not responding';
    } else if (error instanceof TypeError) {
      errorMessage = 'Cannot connect to Flask service - network error or CORS issue';
    }

    return {
      healthy: false,
      status: null,
      error: errorMessage,
    };
  }
}

/**
 * Format error message for display
 * @param {string} error - Error message
 * @returns {string} User-friendly error message
 */
export function formatErrorMessage(error) {
  if (!error) return '';

  const messages = {
    'Service health check timeout': 'Service is not responding (timeout)',
    'Cannot connect': 'Cannot establish connection to Flask service',
    'not responding': 'Flask service is not responding',
  };

  for (const [key, value] of Object.entries(messages)) {
    if (error.includes(key)) {
      return value;
    }
  }

  return error || 'Service unavailable';
}

/**
 * Get Flask service URL from environment or default
 * @returns {string} Flask service URL
 */
export function getFlaskServiceUrl() {
  // Check Vite environment variables
  if (import.meta?.env?.VITE_FLASK_URL) {
    return import.meta.env.VITE_FLASK_URL;
  }

  // Default for development
  return 'http://localhost:5002';
}

/**
 * Retry handler with exponential backoff
 * @param {Function} fn - Function to retry
 * @param {number} maxRetries - Max retry attempts (default: 5)
 * @param {number} initialDelay - Initial delay in ms (default: 1000)
 * @returns {Promise<any>}
 */
export async function retryWithBackoff(fn, maxRetries = 5, initialDelay = 1000) {
  let lastError;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt < maxRetries - 1) {
        // Exponential backoff: 1s, 2s, 4s, 8s, 16s
        const delay = initialDelay * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}
