import mongoose, { Document, Schema, Model } from 'mongoose';
import { crossPlatformDatabase } from '../../db/connection';

/**
 * Interface for CrossPlatformUser
 */
export interface ICrossPlatformUser extends Document {
  email: string;
  phoneNumber: string;
  lotuslearningUserId?: string;
  regenquestUserId?: string;
  spotstitchUserId?: string;
}

/**
 * Schema Definition
 */
const userSchema = new Schema<ICrossPlatformUser>({
  email: {
    type: String,
    required: true,
    unique: true
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true
  },
  lotuslearningUserId: {
    type: String
  },
  regenquestUserId: {
    type: String
  },
  spotstitchUserId: {
    type: String
  }
});

/**
 * Create Model using crossPlatformDatabase connection
 */
const CrossPlatformUser: Model<ICrossPlatformUser> = crossPlatformDatabase.model<ICrossPlatformUser>('User', userSchema);

export default CrossPlatformUser;
