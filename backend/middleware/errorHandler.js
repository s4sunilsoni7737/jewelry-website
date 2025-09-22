// middleware/errorHandler.js
// Global error handling middleware

// 404 Not Found handler
function notFound(req, res, next) {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
}

// Global error handler
function errorHandler(error, req, res, next) {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  // Filter out common browser requests that shouldn't be logged as errors
  const ignoredPaths = [
    '/.well-known/',
    '/favicon.ico',
    '/robots.txt',
    '/sitemap.xml',
    '/apple-touch-icon',
    '/browserconfig.xml',
    '/css/category.css',
    '/js/category.js'
  ];
  
  const shouldIgnore = ignoredPaths.some(path => req.originalUrl.startsWith(path));
  
  // Log error for debugging (except ignored paths)
  if (!shouldIgnore) {
    console.error('Error:', {
      message: error.message,
      stack: error.stack,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
  }

  // Don't leak error details in production
  const message = process.env.NODE_ENV === 'production' 
    ? 'Something went wrong!' 
    : error.message;

  // Handle different types of errors
  if (error.name === 'ValidationError') {
    // Mongoose validation error
    const validationErrors = Object.values(error.errors).map(err => err.message);
    return res.status(400).json({
      error: 'Validation Error',
      details: validationErrors
    });
  }

  if (error.name === 'CastError') {
    // Invalid ObjectId
    return res.status(400).json({
      error: 'Invalid ID format'
    });
  }

  if (error.code === 11000) {
    // Duplicate key error
    return res.status(400).json({
      error: 'Duplicate entry found'
    });
  }

  // Check if it's an AJAX request
  if (req.xhr || req.headers.accept?.indexOf('json') > -1) {
    // Return JSON error for AJAX requests
    res.status(statusCode).json({
      error: message,
      ...(process.env.NODE_ENV !== 'production' && { stack: error.stack })
    });
  } else {
    // Render error page for regular requests
    res.status(statusCode).render('pages/error', {
      title: 'Error',
      error: {
        status: statusCode,
        message: message,
        stack: process.env.NODE_ENV !== 'production' ? error.stack : null
      }
    });
  }
}

// Async error wrapper
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = {
  notFound,
  errorHandler,
  asyncHandler
};
