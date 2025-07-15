import { Request, Response } from 'express';
import OAuthClient from '../models/oauthClient';
import OAuthToken from '../models/oauthToken';
import { generateRandomString } from '../utils/oauthUtils';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: { id: string }; // Extend Request to include user (optional for safety)
}

export const registerClient = async (req: Request, res: Response) => {
  const { name, redirectUri } = req.body;
  const clientId = generateRandomString(8);
  const clientSecret = generateRandomString(16);

  const client = new OAuthClient({ name, redirectUri, clientId, clientSecret });
  await client.save();

  res.json({ clientId, clientSecret });
};

export const authorize = async (req: AuthRequest, res: Response) => {
  const { client_id, redirect_uri, scope, response_type } = req.query;

  if (response_type !== 'code') {
    return res.status(400).json({ error: 'Unsupported response_type' });
  }

  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  const userId = req.user.id;


  // TEMP: Use hardcoded user ID if no auth middleware yet
  // const userId = req.user?.id || "TEMP_USER_ID";

  const code = generateRandomString(16);

  await new OAuthToken({
    clientId: client_id,
    userId: userId,
    code,
    codeExpiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 min
    accessToken: '',
    refreshToken: ''
  }).save();

  res.redirect(`${redirect_uri}?code=${code}`);
};

export const token = async (req: Request, res: Response) => {
  const { client_id, client_secret, code, grant_type } = req.body;

  console.log('Incoming /oauth/token request:', { client_id, client_secret, code, grant_type });

  if (grant_type !== 'authorization_code') {
    return res.status(400).json({ error: 'Unsupported grant_type' });
  }

  // Step 1: Check if clientId exists
  const client = await OAuthClient.findOne({ clientId: client_id });

  if (!client) {
    console.error('Client ID not found in DB:', client_id);
    return res.status(401).json({ error: 'Invalid client_id' });
  }

  // Step 2: Validate client secret
  if (client.clientSecret !== client_secret) {
    console.error('Client secret mismatch for:', client_id);
    return res.status(401).json({ error: 'Invalid client secret' });
  }

  // Step 3: Validate authorization code
  const tokenEntry = await OAuthToken.findOne({ clientId: client_id, code });

  if (!tokenEntry) {
    console.error('Auth code not found for client:', client_id);
    return res.status(400).json({ error: 'Invalid authorization code' });
  }

  if (tokenEntry.codeExpiresAt < new Date()) {
    console.error('Auth code expired:', code);
    return res.status(400).json({ error: 'Authorization code expired' });
  }

  // Step 4: Issue tokens
  const accessToken = jwt.sign({ userId: tokenEntry.userId }, process.env.JWT_SECRET!, { expiresIn: '1h' });
  const refreshToken = generateRandomString(32);

  tokenEntry.accessToken = accessToken;
  tokenEntry.refreshToken = refreshToken;
  await tokenEntry.save();

  console.log('Token issued successfully for client:', client_id);

  res.json({
    access_token: accessToken,
    refresh_token: refreshToken,
    token_type: 'Bearer'
  });
};
