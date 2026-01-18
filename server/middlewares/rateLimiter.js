// Simple in-memory rate limiter middleware
// For production, use Redis-based solution for distributed systems

const rateLimitStore = new Map();

export const createRateLimiter = (windowMs = 60000, maxRequests = 30) => {
  return (req, res, next) => {
    const identifier = req.user?._id || req.ip || req.connection.remoteAddress;
    const key = `${req.path}:${identifier}`;
    const now = Date.now();

    if (!rateLimitStore.has(key)) {
      rateLimitStore.set(key, []);
    }

    const timestamps = rateLimitStore.get(key);

    // Remove old timestamps outside the window
    const validTimestamps = timestamps.filter((t) => now - t < windowMs);

    if (validTimestamps.length >= maxRequests) {
      const retryAfter = Math.ceil(
        (Math.min(...validTimestamps) + windowMs - now) / 1000,
      );
      return res.status(429).json({
        success: false,
        message: `Too many requests. Please try again in ${retryAfter} seconds.`,
        retryAfter,
      });
    }

    validTimestamps.push(now);
    rateLimitStore.set(key, validTimestamps);

    // Clean up old entries periodically
    if (rateLimitStore.size > 10000) {
      for (const [k, v] of rateLimitStore.entries()) {
        const valid = v.filter((t) => now - t < windowMs);
        if (valid.length === 0) {
          rateLimitStore.delete(k);
        }
      }
    }

    next();
  };
};

export default createRateLimiter;
