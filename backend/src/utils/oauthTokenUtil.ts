import OAuthToken from '../models/oauthToken';
import { generateRandomString } from './oauthUtils';
import jwt from 'jsonwebtoken';

export const generateOAuthTokensForUser = async (clientId: string, userId: string) => {
  const code = generateRandomString(16);
  
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET as string,
    { expiresIn: '1h' }
  );

  const refreshToken = generateRandomString(32);

  const tokenEntry = new OAuthToken({
    clientId,
    userId,
    code,
    codeExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
    accessToken,
    refreshToken
  });

  await tokenEntry.save();

  return {
    code,
    accessToken,
    refreshToken
  };
};
