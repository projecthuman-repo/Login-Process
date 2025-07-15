import { Request, Response, NextFunction, Router } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { body, validationResult } from 'express-validator';
import axios from 'axios';
import Email from '../utils/email';
import User, { IUser } from '../models/user';

const authRouter: Router = Router();

interface AuthenticatedRequest extends Request {
  user?: IUser;
}

// Middleware: Protect Route
export const protect = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    let token: string | undefined;

    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      res.status(401).json({ status: 'Fail', error: 'You are not authorized' });
      return;
    }

    const decoded = jwt.verify(token, process.env.SECRET as string) as any;
    const user = await User.findById(decoded.id);

    if (!user) {
      res.status(401).json({ status: 'Fail', error: 'No user associated with token' });
      return;
    }

    if (user.changedPasswordAfter && user.changedPasswordAfter(decoded.iat)) {
      res.status(401).json({ status: 'Fail', error: 'Password was changed, log in again' });
      return;
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ status: 'Fail', error: 'Invalid token' });
  }
};

// POST /api/authentication/forgotPassword
authRouter.post('/forgotPassword', async (req: Request, res: Response) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(404).json({ status: 'Fail', error: 'No user associated with the provided email' });
  }

  const resetToken = user.createPasswordResetToken();
  await user.save();

  const resetURL = `http://localhost:3000/resetPassword/?resetToken=${resetToken}`;
  try {
    await new Email(user, resetURL).sendPasswordReset();
    return res.status(200).json({ status: 'Success', message: 'Token sent to email', resetToken });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return res.status(500).json({ status: 'Fail', error: 'Failed to send reset email' });
  }
});

// POST /api/authentication/access
authRouter.post('/access', async (req: Request, res: Response) => {
  const { username } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ status: 'Fail', error: 'No user associated with the provided username' });
    }

    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.REFRESH_TOKEN_SECRET as string,
      { expiresIn: '7d' }
    );

    user.refreshToken = refreshToken;
    await user.save();

    return res.status(200).json({ status: 'Success', accessToken });
  } catch (error: any) {
    return res.status(500).json({ status: 'Fail', error: error.message });
  }
});

// PATCH /api/authentication/resetPassword
authRouter.patch(
  '/resetPassword',
  body('password')
    .isString()
    .trim()
    .escape()
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      'Passwords must be between 8-10 characters long, have at least one uppercase letter, lowercase letter, number and symbol'
    ),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: 'Fail', error: errors.array().map(e => e.msg).join('\n') });
    }

    const resetToken = req.query.resetToken as string;
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ status: 'Fail', error: 'Token is invalid or expired' });
    }

    const newPassword = req.body.password;
    const newHashedPassword = await bcrypt.hash(newPassword, 10);

    if ((user.previousPasswords || []).some((prev: string) => bcrypt.compareSync(newPassword, prev))) {
      return res.status(400).json({ status: 'Fail', error: 'New password must be different from previous passwords' });
    }

    user.previousPasswords.push(user.passwordHash);

    if (user.previousPasswords.length > 5) {
      user.previousPasswords.shift();
    }

    user.passwordHash = newHashedPassword;
    user.passwordResetExpires = undefined;
    user.passwordResetToken = undefined;
    await user.save();

    res.status(200).json({ status: 'Success', message: 'Successfully reset password' });
  }
);

// POST /api/authentication/verifyCaptcha
authRouter.post('/verifyCaptcha', async (req: Request, res: Response) => {
  const { token } = req.body;

  try {
    const responseCaptcha = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.SECRET_CAPTCHA_KEY}&response=${token}`
    );

    if (responseCaptcha.status === 200) {
      res.status(200).json({ status: 'Success', message: 'Human user' });
    } else {
      res.status(401).json({ status: 'Fail', message: 'Bot detected' });
    }
  } catch (err) {
    res.status(500).json({ status: 'Fail', error: 'Captcha verification failed' });
  }
});

export { authRouter };
