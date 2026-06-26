import rateLimit from 'express-rate-limit';

/**
 * Rate limiter middleware: 30 requests per minute per IP.
 */
const rateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 requests per window per IP
  standardHeaders: true, // Return rate limit info in RateLimit-* headers
  legacyHeaders: false, // Disable X-RateLimit-* headers
  message: {
    success: false,
    error: 'Too many requests. Please try again later.',
    retryAfterMs: 60000,
  },
  keyGenerator: (req) => {
    // Use X-Forwarded-For if behind a proxy, else use socket address
    return (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim()
      || req.socket.remoteAddress
      || 'unknown';
  },
});

export default rateLimiter;
