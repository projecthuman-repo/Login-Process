import express, { Request, Response } from 'express';
import FacebookUser from '../models/facebookUser';
import OAuthToken from '../models/oauthToken';
import { generateRandomString } from '../utils/oauthUtils';
import jwt from 'jsonwebtoken';

const facebookUsersRouter = express.Router();

facebookUsersRouter.post('/', async (req: Request, res: Response) => {
  const { firstName, lastName, email, phoneNumber, clientId } = req.body;

  let facebookUser = await FacebookUser.findOne({ email });

  if (!facebookUser) {
    facebookUser = new FacebookUser({
      firstName,
      lastName,
      email,
      phoneNumber
    });

    await facebookUser.save();
  }

  // 🔐 Issue OAuth2 tokens directly
  const code = generateRandomString(16);
  const accessToken = jwt.sign(
    { userId: facebookUser._id },
    process.env.JWT_SECRET!,
    { expiresIn: '1h' }
  );
  const refreshToken = generateRandomString(32);

  await new OAuthToken({
    clientId,
    userId: facebookUser._id,
    code,
    codeExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
    accessToken,
    refreshToken
  }).save();

  res.status(200).json({
    status: 'Success',
    message: 'User logged in via Facebook OAuth',
    oauth: {
      code,
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: 'Bearer'
    }
  });
});

export default facebookUsersRouter;
// Export the router to be used in the main app