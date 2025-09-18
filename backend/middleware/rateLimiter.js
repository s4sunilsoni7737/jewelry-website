// middleware/rateLimiter.js
// Simple rate limiting implementation without external dependency

// In-memory store for rate limiting
const requestCounts = new Map();

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of requestCounts.entries()) {
    if (now - data.resetTime > data.windowMs) {
      requestCounts.delete(key);
    }
  }
}, 5 * 60 * 1000);

function createRateLimiter(options = {}) {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutes
    max = 100,
    message = 'Too many requests from this IP, please try again later.',
    skipSuccessfulRequests = false
  } = options;

  return (req, res, next) => {
    const key = `${req.ip}_${req.route?.path || req.path}`;
    const now = Date.now();
    
    let requestData = requestCounts.get(key);
    
    if (!requestData || now - requestData.resetTime > windowMs) {
      requestData = {
        count: 0,
        resetTime: now,
        windowMs: windowMs
      };
    }
    
    requestData.count++;
    requestCounts.set(key, requestData);
    
    if (requestData.count > max) {
      return res.status(429).json({
        error: message,
        retryAfter: Math.ceil((requestData.resetTime + windowMs - now) / 1000)
      });
    }
    
    // Add rate limit headers
    res.set({
      'X-RateLimit-Limit': max,
      'X-RateLimit-Remaining': Math.max(0, max - requestData.count),
      'X-RateLimit-Reset': new Date(requestData.resetTime + windowMs)
    });
    
    next();
  };
}

// General rate limiter
const generalLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});

// Strict rate limiter for login attempts
const loginLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: 'Too many login attempts from this IP, please try again after 15 minutes.'
});

// API rate limiter
const apiLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50,
  message: 'Too many API requests from this IP, please try again later.'
});

module.exports = {
  generalLimiter,
  loginLimiter,
  apiLimiter
};
