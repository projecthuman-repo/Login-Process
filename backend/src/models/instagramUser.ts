/**
 * @module instagramUser
 */

import mongoose, { Document, Schema, Model } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

/**
 * Interface for InstagramUser
 */
export interface IInstagramUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  username: string;
}

/**
 * Schema Definition
 */
const instagramUserSchema = new Schema<IInstagramUser>({
  firstName: {
    type: String,
    required: [true, 'A user must have a first name'],
    unique: false
  },
  lastName: {
    type: String,
    required: [true, 'A user must have a last name'],
    unique: false
  },
  email: {
    type: String,
    required: [true, 'A user must have an email'],
    unique: true
  },
  phoneNumber: {
    type: String,
    required: false,
    unique: true,
    sparse: true // allows multiple nulls
  },
  username: {
    type: String,
    required: [true, 'A user must have a username'],
    unique: true,
    sparse: true
  }
});

// Add unique validation plugin
instagramUserSchema.plugin(uniqueValidator);

// Customize JSON output
instagramUserSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

/**
 * Create and export the model
 */
const InstagramUser: Model<IInstagramUser> = mongoose.model<IInstagramUser>('InstagramUser', instagramUserSchema);

export default InstagramUser;
