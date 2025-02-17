const mongoose = require("mongoose");

// Base User Schema (common fields for both male and female)
const baseUserSchema = {
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
};

// Male User Schema
const maleUserSchema = new mongoose.Schema(
  {
    ...baseUserSchema,
    healthConcern: { type: String, required: true },
    hairStage: { type: String },
    dandruff: { type: String },
    dandruffStage: { type: String },
    thinningOrBaldSpots: { type: String },
    energyLevels: { type: String },
  },
  { timestamps: true, collection: "male_users" }
);

// Female User Schema
const femaleUserSchema = new mongoose.Schema(
  {
    ...baseUserSchema,
    naturalHair: { type: String },
    goal: { type: String },
    hairFall: { type: String },
    mainConcern: { type: String },
  },
  { timestamps: true, collection: "female_users" }
);

// Recommendation Schema
const recommendationSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId,
      required: true 
    },
    userGender: { 
      type: String, 
      required: true,
      enum: ['Male', 'Female']
    },
    kit: { 
      type: String, 
      required: true 
    },
    products: [{ 
      type: String, 
      required: true 
    }],
    stage: String,
    dandruffLevel: String,
    energyLevel: String
  },
  { timestamps: true, collection: "recommendations" }
);

const MaleUser = mongoose.model("MaleUser", maleUserSchema);
const FemaleUser = mongoose.model("FemaleUser", femaleUserSchema);
const Recommendation = mongoose.model("Recommendation", recommendationSchema);

module.exports = { MaleUser, FemaleUser, Recommendation };