/**
 * @module facebookUser
 */

import mongoose, { Document, Schema, Model } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

/**
 * Interface for FacebookUser
 */
export interface IFacebookUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string; // optional because of Facebook sign-in
}

/**
 * Schema Definition
 */
const facebookUserSchema = new Schema<IFacebookUser>({
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
    sparse: true // Allows multiple null values without unique conflicts
  }
});

// Add unique validator
facebookUserSchema.plugin(uniqueValidator);

// Format JSON output
facebookUserSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

/**
 * Create and export model
 */
const FacebookUser: Model<IFacebookUser> = mongoose.model<IFacebookUser>('FacebookUser', facebookUserSchema);

export default FacebookUser;
