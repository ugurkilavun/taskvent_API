import mongoose from 'mongoose';

// ? owner, name, description, tags,createdAt
const Schema = new mongoose.Schema({
  owner: mongoose.Schema.Types.ObjectId,
  name: String,
  description: String,
  tags: [String],
  createdAt: Date
}, {
  timestamps: false,
  versionKey: false,
  collection: 'projects'
});

// Collection name
const project = mongoose.model('projects', Schema);

export default project;