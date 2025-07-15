import mongoose, { Document, Schema } from 'mongoose';

export interface IOAuthToken extends Document {
  clientId: string;
  userId: string;
  accessToken?: string;
  refreshToken?: string;
  code: string;
  codeExpiresAt: Date;
}

const OAuthTokenSchema = new Schema<IOAuthToken>({
  clientId: { type: String, required: true },
  userId: { type: String, required: true },
  code: { type: String, required: true },
  codeExpiresAt: { type: Date, required: true },
  accessToken: { type: String, required: false },  // Optional for now
  refreshToken: { type: String, required: false }  // Optional for now
});

export default mongoose.model<IOAuthToken>('OAuthToken', OAuthTokenSchema);
