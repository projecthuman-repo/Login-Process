import express, { Request, Response } from 'express';
import GoogleUser from '../models/googleUser';
import OAuthToken from '../models/oauthToken';
import { generateRandomString } from '../utils/oauthUtils';
import jwt from 'jsonwebtoken';

const googleUsersRouter = express.Router();

googleUsersRouter.post('/', async (req: Request, res: Response) => {
  const { firstName, lastName, email, clientId } = req.body;

  let googleUser = await GoogleUser.findOne({ email });

  if (!googleUser) {
    googleUser = new GoogleUser({ firstName, lastName, email });
    await googleUser.save();
  }

  // 🔐 Issue OAuth2 tokens directly
  const code = generateRandomString(16);
  const accessToken = jwt.sign(
    { userId: googleUser._id },
    process.env.JWT_SECRET!,
    { expiresIn: '1h' }
  );
  const refreshToken = generateRandomString(32);

  await new OAuthToken({
    clientId,
    userId: googleUser._id,
    code,
    codeExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
    accessToken,
    refreshToken
  }).save();

  res.status(200).json({
    status: 'Success',
    message: 'User logged in via Google OAuth',
    oauth: {
      code,
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: 'Bearer'
    }
  });
});

export default googleUsersRouter;
