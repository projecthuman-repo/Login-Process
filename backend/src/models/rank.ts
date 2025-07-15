/**
 * @module rank
 */

import mongoose, { Document, Schema, Model } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

/**
 * Interface for Rank document
 */
export interface IRank extends Document {
  rankId: string;
  rankName: string;
  rankDescription: string;
  rankPoints: number;
}

/**
 * Define Rank schema
 */
const rankSchema = new Schema<IRank>({
  rankId: {
    type: String,
    required: true,
    unique: true
  },
  rankName: {
    type: String,
    required: true
  },
  rankDescription: {
    type: String,
    required: true
  },
  rankPoints: {
    type: Number,
    required: true
  }
});

// Add unique validator plugin
rankSchema.plugin(uniqueValidator);

// Customize JSON output
rankSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

/**
 * Create and export model
 */
const Rank: Model<IRank> = mongoose.model<IRank>('Rank', rankSchema);

export default Rank;
