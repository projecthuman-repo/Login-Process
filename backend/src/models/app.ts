import mongoose, { Document, Schema, Model } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

/**
 * Interface for App model
 */
export interface IApp extends Document {
  appId: string;
  appName: string;
  addDescription: string;
}

/**
 * Define the App schema
 */
const appSchema = new Schema<IApp>({
  appId: {
    type: String,
    required: true,
    unique: true
  },
  appName: {
    type: String,
    required: true
  },
  addDescription: {
    type: String,
    required: true
  }
});

// Add unique validation plugin
appSchema.plugin(uniqueValidator);

// Format output JSON
appSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

/**
 * Create and export App model
 */
const App: Model<IApp> = mongoose.model<IApp>('App', appSchema);

export default App;
