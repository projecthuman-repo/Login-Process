/**
 * @module userRank
 */

import mongoose, { Document, Schema, Model, Types } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

/**
 * Interface for UserRank
 */
export interface IUserRank extends Document {
  userRankID: string;
  user: Types.ObjectId;
  rank: Types.ObjectId;
  app: Types.ObjectId;
  dateAchieved: Date;
  isActive: boolean;
}

/**
 * Define UserRank schema
 */
const userRankSchema = new Schema<IUserRank>({
  userRankID: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rank: {
    type: Schema.Types.ObjectId,
    ref: 'Rank',
    required: true
  },
  app: {
    type: Schema.Types.ObjectId,
    ref: 'App',
    required: true
  },
  dateAchieved: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: false
  }
});

// Add unique validator plugin
userRankSchema.plugin(uniqueValidator);

// Customize JSON output
userRankSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

/**
 * Create and export model
 */
const UserRank: Model<IUserRank> = mongoose.model<IUserRank>('UserRank', userRankSchema);

export default UserRank;
