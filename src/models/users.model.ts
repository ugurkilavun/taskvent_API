import mongoose from 'mongoose';

// const Schema = mongoose.Schema;

// ? firstname, lastname, username, email, password, dateOfBirth, (country), createdAt
const Schema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  username: String,
  email: String,
  password: String,
  dateOfBirth: Date,
  country: String, // Exp: "TR", "US", "DE"
  createdAt: Date,
}, {
  timestamps: false,
  versionKey: false,
  collection: 'users'
});

// Collection name
const users = mongoose.model('users', Schema);

export default users;