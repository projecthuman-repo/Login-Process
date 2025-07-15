/**
 * @module activity
 */

import mongoose, { Document, Schema } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

/**
 * Interface for Activity document
 */
export interface IActivity extends Document {
  activityId: string;
  activityName: string;
  activityDescription: string;
  activityPoints: number;
  appId: mongoose.Types.ObjectId;
}

/**
 * Define Activity schema
 */
const activitySchema = new Schema<IActivity>({
  activityId: {
    type: String,
    required: true,
    unique: true
  },
  activityName: {
    type: String,
    required: true
  },
  activityDescription: {
    type: String,
    required: true
  },
  activityPoints: {
    type: Number,
    required: true
  },
  appId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'App',
    required: true
  }
});

// Add unique validator plugin
activitySchema.plugin(uniqueValidator);

// Format output JSON
activitySchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

/**
 * Create and export model
 */
const Activity = mongoose.model<IActivity>('Activity', activitySchema);

export default Activity;
