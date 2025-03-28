import jwt from 'jsonwebtoken';
import { HTTP_STATUS_CODES, ERROR_MESSAGES } from '../constants/constant.js';
import ApiResponse from './ApiResponse.js';

export const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return ApiResponse.error(res, ERROR_MESSAGES.UNAUTHORIZED, HTTP_STATUS_CODES.UNAUTHORIZED);
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return ApiResponse.error(res, ERROR_MESSAGES.INVALID_TOKEN, HTTP_STATUS_CODES.UNAUTHORIZED);
    }
    req.user = user;
    next();
  });
};

export const requireRole = (role) => (req, res, next) => {
  if (req.user.role !== role) {
    return ApiResponse.error(res, ERROR_MESSAGES.FORBIDDEN, HTTP_STATUS_CODES.FORBIDDEN);
  }
  next();
};

//optional authentication middleware for guest users 
export const optionalAuthenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    // No token provided, but that's okay - proceed as guest
    return next();
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      // Invalid token, but that's okay for optional auth - proceed as guest
      return next();
    }
    
    req.user = user;
    next();
  });
};

