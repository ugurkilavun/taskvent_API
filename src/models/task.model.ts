import mongoose from 'mongoose';

// ? projectID, description, startDate, endDate, members
const Schema = new mongoose.Schema({
  projectID: mongoose.Schema.Types.ObjectId,
  description: String,
  startDate: Date,
  endDate: Date,
  priority: String, // high, medium, low
  members: [mongoose.Schema.Types.ObjectId],
  status: String // process, completed, notCompleted, expired
}, {
  timestamps: false,
  versionKey: false,
  collection: 'tasks'
});

// Collection name
const task = mongoose.model('tasks', Schema);

export default task;