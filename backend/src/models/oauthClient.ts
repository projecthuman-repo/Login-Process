import mongoose, { Document, Schema } from 'mongoose';

export interface IOAuthClient extends Document {
  name: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

const OAuthClientSchema = new Schema<IOAuthClient>({
  name: { type: String, required: true },
  clientId: { type: String, required: true, unique: true },
  clientSecret: { type: String, required: true },
  redirectUri: { type: String, required: true }
});

export default mongoose.model<IOAuthClient>('OAuthClient', OAuthClientSchema);
