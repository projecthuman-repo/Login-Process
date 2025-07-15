/**
 * @module userApp
 */

import mongoose, { Document, Schema, Model, Types } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

/**
 * Interface for UserApp document
 */
export interface IUserApp extends Document {
  user: Types.ObjectId;
  app: Types.ObjectId;
  appVersion: Types.ObjectId;
  lastActivityDate?: Date;
  totalActivityTime?: number;
  appRank?: Types.ObjectId;
}

/**
 * Define UserApp schema
 */
const userAppSchema = new Schema<IUserApp>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  app: {
    type: Schema.Types.ObjectId,
    ref: 'App',
    required: true
  },
  appVersion: {
    type: Schema.Types.ObjectId,
    ref: 'App Version',
    required: true
  },
  lastActivityDate: {
    type: Date
  },
  totalActivityTime: {
    type: Number
  },
  appRank: {
    type: Schema.Types.ObjectId,
    ref: 'Rank'
  }
});

// Add unique validator plugin
userAppSchema.plugin(uniqueValidator);

// Customize JSON output
userAppSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

/**
 * Create and export model
 */
const UserApp: Model<IUserApp> = mongoose.model<IUserApp>('UserApp', userAppSchema);

export default UserApp;
