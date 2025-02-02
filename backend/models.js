const mongoose = require("mongoose");

// Define User Schema (Stores in 'users' collection)
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
  },
  { timestamps: true, collection: "users" } // <-- Ensure collection name is 'users'
);

// Define Answer Schema (Stores in 'Answers_for_Hair' collection)
const answerSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    healthConcern: { type: String, required: true },
    hairStage: { type: String, required: true },
    dandruff: { type: String, required: true },
    dandruffStage: { type: String, required: true },
    thinningOrBaldSpots: { type: String, required: true },
    naturalHair: { type: String },
    goal: { type: String },
    hairFall: { type: String },
    mainConcern: { type: String },
  },
  { timestamps: true, collection: "Answers_for_Hair" } // <-- Saves to 'Answers_for_Hair'
);

// Create Models
const User = mongoose.model("User", userSchema);
const Answer = mongoose.model("Answer", answerSchema);

module.exports = { User, Answer };
