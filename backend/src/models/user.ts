import mongoose, { Document, Schema, Types } from 'mongoose';
import crypto from 'crypto';
import uniqueValidator from 'mongoose-unique-validator';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  username: string;
  passwordHash: string;
  email: string;
  phoneNumber: string;
  refreshToken?: string;
  picture?: string;
  banner?: string;
  biography?: string;
  website?: string;
  userType: string;
  token?: string;
  emailToken?: string;
  isVerified: boolean;
  otpCode?: string;
  otpExpiresAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  passwordChangedAt?: Date;
  registrationDate: Date;
  lastLoginDate?: Date;
  previousPasswords: string[];
  otherAccounts?: Map<string, string[]>;
  status: string;
  newMessages: Record<string, any>;
  chats: Types.ObjectId[];
  addresses: Types.ObjectId[];
  Layers: Types.ObjectId[];
  gameInventory: Types.ObjectId[];
  productInventory: Types.ObjectId[];
  wallet: Types.ObjectId[];
  notifications: Types.ObjectId[];
  settings?: Types.ObjectId;
  following: string[];
  followers: string[];
  posts: Types.ObjectId[];

  changedPasswordAfter: (jwtTimestamp: number) => boolean;
  createPasswordResetToken: () => string;
}

const userSchema = new Schema<IUser>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true, unique: true, sparse: true },
  passwordHash: { type: String, required: true },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: true,
    index: true,
    validate: {
      validator: (email: string) => /\S+@\S+\.\S+/.test(email),
      message: 'Invalid email'
    }
  },
  phoneNumber: { type: String, required: true, unique: true, sparse: true },
  picture: String,
  banner: String,
  biography: String,
  website: String,
  userType: { type: String, default: 'personal', required: true },
  token: String,
  emailToken: String,
  refreshToken: { type: String },  // Optional field for refresh token
  isVerified: { type: Boolean, default: false },
  otpCode: String,
  otpExpiresAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  passwordChangedAt: Date,
  registrationDate: { type: Date, default: Date.now },
  lastLoginDate: { type: Date, default: null },
  previousPasswords: { type: [String], default: [] },
  otherAccounts: { type: Map, of: [String] },
  status: { type: String, default: 'online' },
  newMessages: { type: Object, default: {} },
  chats: [{ type: Schema.Types.ObjectId, ref: 'Chat' }],
  addresses: [{ type: Schema.Types.ObjectId, ref: 'Address' }],
  Layers: [{ type: Schema.Types.ObjectId, ref: 'Layer' }],
  gameInventory: [{ type: Schema.Types.ObjectId, ref: 'GameInventory' }],
  productInventory: [{ type: Schema.Types.ObjectId, ref: 'ProductInventory' }],
  wallet: [{ type: Schema.Types.ObjectId, ref: 'Wallet' }],
  notifications: [{ type: Schema.Types.ObjectId, ref: 'Notification' }],
  settings: { type: Schema.Types.ObjectId, ref: 'Settings' },
  following: { type: [String], default: [] },
  followers: { type: [String], default: [] },
  posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }]
});

userSchema.plugin(uniqueValidator);

userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    delete ret.passwordHash;
  }
});

userSchema.pre<IUser>('save', function (next) {
  if (!this.isModified('passwordHash') || this.isNew) return next();
  this.passwordChangedAt = new Date(Date.now() - 1000);
  next();
});

userSchema.methods.changedPasswordAfter = function (jwtTimestamp: number): boolean {
  if (this.passwordChangedAt) {
    const changedTimestamp = this.passwordChangedAt.getTime() / 1000;
    return changedTimestamp > jwtTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function (): string {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
  return resetToken;
};

const User = mongoose.model<IUser>('User', userSchema);
export default User;
