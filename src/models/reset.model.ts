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
  collection: 'resets'
});

// Collection name
const reset = mongoose.model('resets', Schema);

export default reset;