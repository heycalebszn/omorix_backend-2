import otpGenerator from 'otp-generator';
import { User } from '../models/index.js';
import { VALIDATION, ERROR_MESSAGES } from '../constants/constant.js';
import { sendOtpEmail } from './emailService.js';

export const generateAndSendOtp = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
  }

  const otp = otpGenerator.generate(6, {
    digits: true,
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });

  await User.update(
    {
      otpSecret: otp,
      otpExpiry: new Date(Date.now() + VALIDATION.OTP_EXPIRY_MINUTES * 60 * 1000),
    },
    { where: { id: userId } },
  );

  const customer = await user.getCustomerProfile();
  return await sendOtpEmail(user.email, otp, customer?.firstName);
};

export const verifyOtp = async (userId, otp) => {
  const user = await User.findByPk(userId);
  if (!user || user.otpSecret !== otp || user.otpExpiry < new Date()) {
    throw new Error(ERROR_MESSAGES.INVALID_OTP);
  }
  await User.update(
    {
      isVerified: true,
      otpSecret: null,
      otpExpiry: null,
    },
    { where: { id: userId } },
  );
  return true;
};
