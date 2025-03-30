import sequelize from '../config/database.js';
import { User, Customer } from '../models/index.js';
import ApiResponse from '../utils/ApiResponse.js';
import { HTTP_STATUS_CODES, ERROR_MESSAGES, ROLES } from '../constants/constant.js';
import { generateAndSendOtp, verifyOtp } from '../services/authService.js';
import jwt from 'jsonwebtoken';
import argon2 from 'argon2';

export const register = async (req, res, next) => {
  const { email, password, firstName, lastName, phone, role } = req.body;
  const t = await sequelize.transaction();
  try {
    // Assign role dynamically, defaulting to CUSTOMER if not provided
    const userRole = role || ROLES.CUSTOMER;

    const user = await User.create(
      {
        email,
        password,
        role: userRole,
      },
      { transaction: t },
    );

    await Customer.create({ userId: user.id, firstName, lastName, phone }, { transaction: t });
    await t.commit();
    const result = await generateAndSendOtp(user.id);
    return ApiResponse.success(res, result.message, { userId: user.id }, HTTP_STATUS_CODES.CREATED);
  } catch (error) {
    await t.rollback();
    next(error);
  }
};

// export const register = async (req, res, next) => {
//   const { email, password, firstName, lastName, phone, role } = req.body;
//   const t = await sequelize.transaction();
//   try {
//     // Assign role dynamically, defaulting to CUSTOMER if not provided
//     const userRole = role || ROLES.CUSTOMER;

//     const user = await User.create(
//       {
//         email,
//         password,
//         role: userRole,
//       },
//       { transaction: t },
//     );

//     await Customer.create({ userId: user.id, firstName, lastName, phone }, { transaction: t });
//     await t.commit();
//     const result = await generateAndSendOtp(user.id);
//     return ApiResponse.success(res, result.message, { userId: user.id }, HTTP_STATUS_CODES.CREATED);
//   } catch (error) {
//     await t.rollback();
//     next(error);
//   }
// };

// export const register = async (req, res, next) => {
//   const { email, password, firstName, lastName, phone, role } = req.body;
//   const t = await sequelize.transaction();

//   try {
//     const userRole = role || ROLES.CUSTOMER;

//     const user = await User.create(
//       {
//         email,
//         password,
//         role: userRole,
//       },
//       { transaction: t },
//     );

//     await Customer.create(
//       {
//         userId: user.id,
//         firstName,
//         lastName,
//         phone,
//       },
//       { transaction: t },
//     );

//     // Commit transaction before sending email
//     await t.commit();

//     try {
//       const result = await generateAndSendOtp(user.id);
//       return ApiResponse.success(
//         res,
//         result.message,
//         { userId: user.id },
//         HTTP_STATUS_CODES.CREATED,
//       );
//     } catch (emailError) {
//       // Email failed but user was created successfully
//       console.error('OTP email failed:', emailError);
//       return ApiResponse.success(
//         res,
//         'User created but OTP email failed',
//         { userId: user.id },
//         HTTP_STATUS_CODES.CREATED,
//       );
//     }
//   } catch (error) {
//     // Only rollback if transaction hasn't been committed
//     if (!t.finished) {
//       await t.rollback();
//     }
//     next(error);
//   }
// };

export const verifyOtpHandler = async (req, res, next) => {
  const { userId, otp } = req.body;
  try {
    await verifyOtp(userId, otp);
    return ApiResponse.success(res, 'Email verified');
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user || !(await argon2.verify(user.password, password))) {
      return ApiResponse.error(
        res,
        ERROR_MESSAGES.INVALID_CREDENTIALS,
        HTTP_STATUS_CODES.UNAUTHORIZED,
      );
    }
    if (!user.isVerified) {
      return ApiResponse.error(res, ERROR_MESSAGES.EMAIL_NOT_VERIFIED, HTTP_STATUS_CODES.FORBIDDEN);
    }
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    await User.update({ lastLogin: new Date() }, { where: { id: user.id } });
    return ApiResponse.success(res, 'Login successful', { token });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return ApiResponse.error(res, ERROR_MESSAGES.USER_NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND);
    }
    await generateAndSendOtp(user.id);
    return ApiResponse.success(res, 'Reset OTP sent', { userId: user.id });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  const { userId, otp, newPassword } = req.body;
  try {
    await verifyOtp(userId, otp);
    const user = await User.findByPk(userId);
    user.password = newPassword;
    await user.save();
    return ApiResponse.success(res, 'Password reset successful');
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  try {
    const user = await User.findByPk(req.user.id);
    if (!(await argon2.verify(user.password, oldPassword))) {
      return ApiResponse.error(
        res,
        ERROR_MESSAGES.INVALID_CREDENTIALS,
        HTTP_STATUS_CODES.UNAUTHORIZED,
      );
    }
    user.password = newPassword;
    await user.save();
    return ApiResponse.success(res, 'Password changed');
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res) => {
  await User.update({ refreshToken: null, token: null }, { where: { id: req.user.id } });
  return ApiResponse.success(res, 'Logged out');
};
