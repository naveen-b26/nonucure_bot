const mongoose = require("mongoose");

// Define User Schema (Stores in 'users' collection)
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true }, // Male or Female
  },
  { timestamps: true, collection: "users" }
);

// Define Answer Schema (Stores in 'Answers_for_Hair' collection)
const answerSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    
    // Male-specific questions
    healthConcern: { type: String, required: true }, // Required for both Male and Female
    hairStage: { type: String }, // Required for Male
    dandruff: { type: String }, // Required for Male
    dandruffStage: { type: String }, // Required for Male
    thinningOrBaldSpots: { type: String }, // Required for Male
    energyLevels:{type:String},
    
    // Female-specific questions
    naturalHair: { type: String }, // Optional for Female
    goal: { type: String }, // Optional for Female
    hairFall: { type: String }, // Optional for Female
    mainConcern: { type: String }, // Optional for Female
    
    // Optionally include an image for Male's hair stage
    hairStageImage: { type: String }, // URL of image, only for Male

  },
  { timestamps: true, collection: "Answers_for_Hair" }
);

// Create Models
const User = mongoose.model("User", userSchema);
const Answer = mongoose.model("Answer", answerSchema);

module.exports = { User, Answer };