const mongoose = require('mongoose');

// Define User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
}, { timestamps: true });

// Define Answer Schema
const answerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  healthConcern: { type: String, required: true },
  hairStage: { type: String, required: true },
  dandruff: { type: String, required: true },
  dandruffStage: { type: String, required: true },
  thinningOrBaldSpots: { type: String, required: true },
  naturalHair: { type: String },
  goal: { type: String },
  hairFall: { type: String },
  mainConcern: { type: String },
}, { timestamps: true });

// Create Models
const User = mongoose.model('User', userSchema);
const Answer = mongoose.model('Answer', answerSchema);

module.exports = { User, Answer };
