// middleware/errorHandler.js
const mongoose = require('mongoose');

const errorHandler = (err, req, res, next) => {
  console.error(err);

  // Mongoose duplicate key
  if (err.code && err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({ message: `${field} already exists` });
  }

  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({ message: err.message });
  }

  // Custom errors may carry statusCode
  const status = err.statusCode || 500;
  const message = err.message || 'Server Error';
  res.status(status).json({ message });
};

module.exports = errorHandler;
