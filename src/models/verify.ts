import mongoose from 'mongoose';

// ? id, token, expiresAt, used
const Schema = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  token: String,
  expiresAt: Date,
  used: Boolean,
}, {
  timestamps: false,
  versionKey: false,
  collection: 'verify'
});

// Collection name
const verify = mongoose.model('verify', Schema);

export default verify;