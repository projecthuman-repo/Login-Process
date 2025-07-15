import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import xssFilters from 'xss-filters';
import emailValidator from 'email-validator';

import User from '../models/user';
import { generateOTP, generateResetToken } from '../utils/otpUtil';
import Email from '../utils/email';
import { protect } from '../utils/auth';

const router: Router = Router();

interface AuthenticatedRequest extends Request {
  user?: any; 
}

/**
 * POST /api/auth/register
 */
router.post('/register', async (req: Request, res: Response) => {
  try {
    const cleanEmail = xssFilters.inHTMLData(req.body.email);
    const cleanPassword = xssFilters.inHTMLData(req.body.password);

    if (!emailValidator.validate(cleanEmail)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(cleanPassword, 10);
    const otpCode = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const newUser = new User({
      email: cleanEmail,
      passwordHash: hashedPassword,
      otpCode,
      otpExpiresAt,
      firstName: 'Temp',
      lastName: 'User',
      username: cleanEmail.split('@')[0],
      phoneNumber: Date.now().toString()
    });

    await newUser.save();

    const verificationUrl = `${process.env.FRONTEND_URL}/verify?email=${encodeURIComponent(cleanEmail)}`;
    await new Email(newUser, verificationUrl).send('Your OTP Code', `Your OTP is: ${otpCode}`);

    res.status(201).json({ message: 'OTP sent to your email' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/auth/verify-otp
 */
router.post('/verify-otp', async (req: Request, res: Response) => {
  try {
    const cleanEmail = xssFilters.inHTMLData(req.body.email);
    const cleanOtp = xssFilters.inHTMLData(req.body.otp);

    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.otpCode !== cleanOtp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }
    if (user.otpExpiresAt && user.otpExpiresAt < new Date()) {
      return res.status(400).json({ error: 'OTP has expired' });
    }

    user.isVerified = true;
    user.otpCode = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully!' });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/auth/resend-otp
 */
router.post('/resend-otp', async (req: Request, res: Response) => {
  try {
    const cleanEmail = xssFilters.inHTMLData(req.body.email);
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (user.isVerified) {
      return res.status(400).json({ error: 'User is already verified' });
    }

    const newOtp = generateOTP();
    user.otpCode = newOtp;
    user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    const verificationUrl = `${process.env.FRONTEND_URL}/verify?email=${encodeURIComponent(cleanEmail)}`;
    await new Email(user, verificationUrl).send('Your NEW OTP Code', `Your new OTP is: ${newOtp}`);

    res.json({ message: 'New OTP sent to your email' });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/auth/forgot-password
 */
router.post('/forgot-password', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'No user with that email' });
    }

    const token = generateResetToken();
    user.passwordResetToken = token;
    user.passwordResetExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    await new Email(user, resetUrl).sendPasswordReset();

    res.json({ message: 'Password reset token sent to your email' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/auth/reset-password
 */
router.post('/reset-password', async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ error: 'Token is invalid or expired' });
    }

    user.passwordHash = await bcrypt.hash(password, 12);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.json({ message: 'Password has been reset' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/auth/login
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !user.isVerified) {
      return res.status(401).json({ error: 'Invalid credentials or not verified' });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined');
    }

    const payload = { id: user._id.toString() } as const;

    const token = jwt.sign(
      payload,
      jwtSecret,
      { expiresIn: '3d' }
    );

    res.json({
      token,
      user: {
        email: user.email,
        isVerified: user.isVerified,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/auth/me
 */
router.get('/me', protect, (req: AuthenticatedRequest, res: Response) => {
  res.json(req.user);
});

/**
 * DELETE /api/auth/me
 */
router.delete('/me', protect, async (req: AuthenticatedRequest, res: Response) => {
  try {
    await User.deleteOne({ _id: req.user._id });
    return res.json({ message: 'Account deleted successfully' });
  } catch (err) {
    console.error('Account deletion error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
