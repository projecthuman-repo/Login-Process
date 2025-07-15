import crypto from 'crypto';

export const generateRandomString = (length: number): string => {
  return crypto.randomBytes(length).toString('hex');
};
