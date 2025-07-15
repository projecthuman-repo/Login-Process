/**
 * @module userActivity
 */

import mongoose, { Document, Schema, Model, Types } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

/**
 * Interface for UserActivity document
 */
export interface IUserActivity extends Document {
  userActivityID: string;
  user: Types.ObjectId;
  activity: Types.ObjectId;
  datePerformed: Date;
  pointsEarned: number;
}

/**
 * Define UserActivity schema
 */
const userActivitySchema = new Schema<IUserActivity>({
  userActivityID: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  activity: {
    type: Schema.Types.ObjectId,
    ref: 'Activity',
    required: true
  },
  datePerformed: {
    type: Date,
    required: true
  },
  pointsEarned: {
    type: Number,
    required: true
  }
});

// Add better validations for uniqueness
userActivitySchema.plugin(uniqueValidator);

// Customize JSON output
userActivitySchema.set('toJSON', {
  transform: (_document, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  }
});

/**
 * Create and export model
 */
const UserActivity: Model<IUserActivity> = mongoose.model<IUserActivity>('UserActivity', userActivitySchema);

export default UserActivity;
