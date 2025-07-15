import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { body, validationResult } from 'express-validator';
import User, { IUser } from '../models/user';

const loginRouter = express.Router();

function isEmail(value: string): boolean {
  const validPattern = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/;
  return validPattern.test(value);
}

loginRouter.post(
  '/',
  body('username')
    .notEmpty()
    .trim()
    .escape()
    .withMessage('Invalid input for username'),
  body('password')
    .notEmpty()
    .trim()
    .escape()
    .withMessage('Invalid input for password'),

  async (req: Request, res: Response) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) {
      const list_errors = errors.map(err => err.msg).join('\n');
      return res.status(400).json({
        status: 'Fail',
        error: list_errors
      });
    }

    const { username, password, mainmail } = req.body;

    let user: IUser | null = null;

    if (isEmail(username)) {
      user = await User.findOne({ email: username }) as IUser;
    } else {
      user = await User.findOne({ username }) as IUser;
    }

    let mainEmail: IUser | null = null;
    if (mainmail) {
      mainEmail = await User.findOne({ email: mainmail }) as IUser;
    }

    if (!user) {
      return res.status(401).json({
        status: 'Fail',
        error: 'Invalid username or password'
      });
    }

    const passwordCorrect =
      await bcrypt.compare(password, user.passwordHash) || password === user.passwordHash;

    if (!passwordCorrect) {
      return res.status(401).json({
        status: 'Fail',
        error: 'Invalid username or password'
      });
    }

    if (user.isVerified === false) {
      return res.status(401).json({
        status: 'Fail',
        error: 'Account is not verified. Please check your email.'
      });
    }

    const userForToken = {
      username: user.username,
      id: user._id
    };

    const token = jwt.sign(
      userForToken,
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: '3d' }
    );

    user.lastLoginDate = new Date();
    user.token = token;

    // Initialize otherAccounts if undefined
    if (!user.otherAccounts) {
      user.otherAccounts = new Map<string, string[]>();
    }

    // Handle linking to main account
    if (mainEmail) {
      if (!mainEmail.otherAccounts) {
        mainEmail.otherAccounts = new Map<string, string[]>();
      }

      const userIdStr = user._id.toString();

      if (!mainEmail.otherAccounts.has(userIdStr)) {
        mainEmail.otherAccounts.set(userIdStr, [
          user.username,
          user.picture || '',
          user.token || '',
          user.passwordHash
        ]);
        await mainEmail.save();
      }

      const mainIdStr = mainEmail._id.toString();
      user.otherAccounts.set(mainIdStr, [
        mainEmail.username,
        mainEmail.picture || '',
        mainEmail.token || '',
        mainEmail.passwordHash
      ]);
    }

    await user.save();

    res.status(200).json({
      status: 'Success',
      token,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      otherAccounts: user.otherAccounts
    });
  }
);

export default loginRouter;
