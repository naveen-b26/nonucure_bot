const mongoose = require("mongoose");

// Male User Schema
const maleUserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    healthConcern: { 
      type: String, 
      required: true,
      enum: ["Hair Loss","Beard Growth"]
    },
    hairStage: { type: String },
    dandruff: { type: String },
    dandruffStage: { type: String },
    thinningOrBaldSpots: { type: String },
    energyLevels: { type: String },
    medicalConditions: [{
      type: String,
      enum: ['High Blood Pressure (BP)', 'Diabetes (Sugar)', 'Thyroid Issues', 'None of the above']
    }],
    previousTreatment: { type: String },
    treatmentExperience: { type: String },
    previousTreatmentSteps: { type: String }
  },
  { timestamps:true,collection: "male_users" }
);

// Female User Schema
const femaleUserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    healthConcern: { 
      type: String, 
      required: true,
      enum: ['Hair thinning', 'Coin size patches', 'Medium widening', 'Advanced widening', 'Less volume on sides']
    },
    naturalHair: { type: String },
    goal: { type: String },
    hairFall: { type: String },
    mainConcern: { type: String },
    medicalConditions: [{
      type: String,
      enum: ['High Blood Pressure (BP)', 'Diabetes (Sugar)', 'Thyroid Issues', 'None of the above']
    }],
    previousTreatment: { type: String },
    treatmentExperience: { type: String },
    previousTreatmentSteps: { type: String },
    hairStage: {
      type: String,
      enum: [
        'Stage 1 (Early thinning)',
        'Stage 2 (Widening of the part)',
        'Stage 3 (Crown area thinning)',
        'Stage 4 (Visible scalp)',
        'Stage 5 (Advanced thinning)'
      ]
    },
    dandruff: {
      type: String,
      enum: ['Yes', 'No']
    },
    dandruffStage: {
      type: String,
      enum: ['Mild', 'Moderate', 'Severe']
    },
    pregnancyStatus: {
      type: String,
      enum: [
        'Recently had a baby (< 1 year)',
        'Planning for pregnancy',
        'None'
      ]
    },
    previousTreatment: { type: String },
    treatmentExperience: { type: String },
    previousTreatmentSteps: { type: String }
  },
  { timestamps:true, collection: "female_users" }
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
    healthConcern: {
      type: String,
      required: true,
      enum: ['Hair Loss', 'Beard Growth', 'Hair thinning', 'Less volume on sides', 'Coin size patches', 'Medium widening', 'Advanced widening']
    },
    kit: { 
      type: String, 
      required: true 
    },
    products: [{ 
      type: String, 
      required: true 
    }],
    description: {
      type: String
    },
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