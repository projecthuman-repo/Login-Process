/**
 * @module googleUser
 */

import mongoose, { Document, Schema, Model } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

/**
 * Interface for GoogleUser
 */
export interface IGoogleUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
}

/**
 * Schema Definition
 */
const googleUserSchema = new Schema<IGoogleUser>({
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
  }
});

// Add uniqueness validation plugin
googleUserSchema.plugin(uniqueValidator);

// Customize toJSON output
googleUserSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

/**
 * Create and export the model
 */
const GoogleUser: Model<IGoogleUser> = mongoose.model<IGoogleUser>('GoogleUser', googleUserSchema);

export default GoogleUser;
