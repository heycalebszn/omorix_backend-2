import express from 'express'
import { authenticateToken } from '../utils/authMiddleware.js'
import {
    register,
    verifyOtpHandler,
    login,
    forgotPassword,
    resetPassword,
    changePassword,
    logout
} from '../controllers/authController.js'
import { validateRequest } from '../middlewares/authValidate.js'
import {
    registerSchema,
    otpVerificationSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    changePasswordSchema
} from '../validations/index.js'

const router = express.Router()

router.post('/register', validateRequest(registerSchema), register)
router.post('/verify-otp', validateRequest(otpVerificationSchema), verifyOtpHandler)
router.post('/login', validateRequest(loginSchema), login)
router.post('/forgot-password', validateRequest(forgotPasswordSchema), forgotPassword)
router.post('/reset-password', validateRequest(resetPasswordSchema), resetPassword)
router.patch(
    '/change-password',
    authenticateToken,
    validateRequest(changePasswordSchema),
    changePassword
)
router.post('/logout', authenticateToken, logout)

export default router
