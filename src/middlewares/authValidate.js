import { HTTP_STATUS_CODES, ERROR_MESSAGES } from '../constants/constant.js';
import multer from 'multer';


export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body || req.query, { abortEarly: false });
    if (error) {
      const errorDetails = error.details.map(detail => ({
        message: detail.message,
        path: detail.path
      }));
      return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: ERROR_MESSAGES.VALIDATION_ERROR,
        errors: errorDetails
      });
    }
    next();
  };
};



const storage = multer.memoryStorage();
export const uploadCategoryImage = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1 // Only one image for category banner
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Only JPEG, PNG, and GIF images are allowed'));
    }
    cb(null, true);
  }
}).single('image'); // Expect a single file with field name 'image'