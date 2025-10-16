import { NotFoundError, ValidationError } from '../utils/errors.js';

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  if (err instanceof NotFoundError) {
    return res.status(err.statusCode).json({
      error: err.name,
      message: err.message
    });
  }
  
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json({
      error: err.name,
      message: err.message,
      details: err.details
    });
  }
  
  // Handle other types of errors
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    error: 'InternalServerError',
    message: message
  });
};

export default errorHandler;