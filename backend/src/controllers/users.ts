import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { body, validationResult } from 'express-validator';
import emailValidator from 'email-validator';
import jwt from 'jsonwebtoken';

import User from '../models/user';
import UserApp from '../models/userApp';
import CrossPlatformUser from '../models/cross-platform/user';
import Email from '../utils/email';
import { protect } from './auth';

const usersRouter = express.Router();

// GET /api/users/
usersRouter.get('/', async (req: Request, res: Response) => {
  const username = req.query.username as string;

  if (!username) {
    const users = await User.find({});
    return res.json({
      status: 'Success',
      numberOfUsers: users.length,
      users
    });
  }

  const user = await User.findOne({ username });

  if (!user) {
    return res.status(404).json({
      status: 'Fail',
      error: 'User not found'
    });
  }

  res.json({
    status: 'Success',
    user
  });
});

// POST /api/users/ (Register user)
usersRouter.post(
  '/',
  [
    body('email').isString().trim().isEmail().normalizeEmail(),
    body('password').isString().trim().escape().isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    }),
    body('username').isString().notEmpty().trim().escape(),
    body('firstName').isString().notEmpty().trim().escape(),
    body('lastName').isString().notEmpty().trim().escape(),
    body('phoneNumber').isString().notEmpty().trim().escape().isMobilePhone('any')
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req).array();
    let errorList = '';

    if (!emailValidator.validate(req.body.email)) {
      errorList += 'Email is not valid\n';
    }

    for (const err of errors) {
      errorList += err.msg + '\n';
    }

    if (errorList) {
      return res.status(400).json({ status: 'Fail', error: errorList });
    }

    const { firstName, lastName, username, password, email, phoneNumber } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const emailToken = crypto.randomBytes(32).toString('hex');

    const newUser = new User({
      firstName,
      lastName,
      username,
      passwordHash,
      email,
      phoneNumber,
      isVerified: false,
      emailToken
    });

    await newUser.save();

    const url = `http://localhost:3000/verification/?token=${emailToken}`;
    await new Email(newUser, url).sendWelcomeToApp();

    res.status(201).json({
      status: 'Success',
      emailToken,
      newUser
    });
  }
);

// PATCH /api/users/verification
usersRouter.patch('/verification', async (req: Request, res: Response) => {
  const token = req.query.token as string;
  const user = await User.findOne({ emailToken: token });

  if (!user) {
    return res.status(401).json({
      status: 'Fail',
      error: 'Invalid token'
    });
  }

  user.isVerified = true;
  user.token = jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET as string, { expiresIn: '3d' });
  await user.save();

  res.json({
    status: 'Success',
    token: user.token,
    message: 'User verified'
  });
});

export default usersRouter;
