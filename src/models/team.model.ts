import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
  title: String,
  description: String,
  owner: mongoose.Schema.Types.ObjectId,
  projectManagers: [mongoose.Schema.Types.ObjectId],
  teamLeaders: [mongoose.Schema.Types.ObjectId],
  members: [mongoose.Schema.Types.ObjectId],
  createdAt: Date,
}, {
  timestamps: false,
  versionKey: false,
  collection: 'teams'
});

// Collection name
const team = mongoose.model('teams', Schema);

export default team;