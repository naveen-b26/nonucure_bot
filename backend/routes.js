const express = require('express');
const { User, Answer } = require('./models');
const router = express.Router();

// Submit Form Route
router.post("/submit-form", async (req, res) => {
  try {
    console.log("Received Request Body:", req.body);

    const { formData, responses } = req.body;

    if (!formData || !responses) {
      return res.status(400).json({ error: "Missing form data or responses" });
    }

    // Gender-based Question Handling
    const { gender } = formData;

    // Define male and female specific questions (You can replace these with dynamic question generation if needed)
    const maleQuestions = [
      {
        text: "Select your primary health concern:",
        name: "healthConcern",
        options: ["Hair Loss", "Sexual Health", "Beard Growth"],
      },
      {
        text: "Please select your hair stage:",
        name: "hairStage",
        img: "/hair-men.jpg",
        options: [
          "Stage 1 (Slightly hair loss)",
          "Stage 2 (Hair line receding)",
          "Stage 3 (Developing bald spot)",
          "Stage 4 (Visible bald spot)",
          "Stage 5 (Balding from crown area)",
          "Stage 6 (Advanced balding)",
          "Heavy Hair Fall",
          "Coin Size Patch",
        ],
      },
      {
        text: "Do you have dandruff?",
        name: "dandruff",
        options: ["Yes", "No"],
      },
      {
        text: "Select your dandruff stage:",
        name: "dandruffStage",
        options: ["Low", "Mild", "Moderate", "Severe"],
      },
      {
        text: "Are you experiencing hair thinning or bald spots?",
        name: "thinningOrBaldSpots",
        options: [
          "Yes, both",
          "Yes, thinning only",
          "Yes, bald spots only",
          "No",
          "I'm not sure",
        ],
      },
      {
        text: "How would you rate your energy levels?",
        name: "energyLevels",
        options: ["High", "Medium", "Low"],
      },
    ];

    const femaleQuestions = [
      {
        text: "What does your hair look like naturally?",
        name: "naturalHair",
        options: ["Straight", "Curly", "Wavy", "Coily"],
      },
      {
        text: "What is your current goal?",
        name: "goal",
        options: ["Control hair fall", "Regrow Hair"],
      },
      {
        text: "Do you feel more hair fall than usual?",
        name: "hairFall",
        options: ["Yes, extreme", "Mild", "No"],
      },
      {
        text: "Choose your main concern:",
        name: "mainConcern",
        options: [
          "Hair thinning",
          "Coin size patches",
          "Medium widening",
          "Advanced widening",
          "Less volume on sides",
        ],
      },
    ];

    // Set the appropriate set of questions based on gender
    const questions = gender === 'Male' ? maleQuestions : femaleQuestions;

    // Save user data (in 'users' collection)
    const user = new User(formData);
    const savedUser = await user.save();
    console.log("✅ User Saved:", savedUser);

    // Save answers (in 'Answers_for_Hair' collection)
    const answer = new Answer({ userId: savedUser._id, ...responses });
    const savedAnswer = await answer.save();
    console.log("✅ Answer Saved in Answers_for_Hair:", savedAnswer);

    res.status(200).json({ message: "Form submitted successfully" });
  } catch (error) {
    console.error("❌ Error saving data to MongoDB:", error);
    res.status(500).json({ error: error.message });
  }
});

// Recommend Route
router.post('/recommend', async (req, res) => {
  const { stage, dandruffLevel, energyLevel } = req.body;
  let recommendation = {};

  // Adjusted stage logic based on the string options you provided
  if (stage === "Stage 1 (Slightly hair loss)" || stage === "Stage 2 (Hair line receding)") {
    recommendation.kit = 'Classic Kit';
    recommendation.products = ['Gummies', 'Sinibis', 'Minoxidil 5%'];
  } else if (stage === "Stage 3 (Developing bald spot)" || stage === "Stage 4 (Visible bald spot)") {
    recommendation.kit = 'Complete Hair Kit';
    recommendation.products = ['Gummies', 'Sinibis', 'Minoxidil 5%'];
    // if (wantsFinibis) {
    //   recommendation.products.push('Finibis');
    // }
  } else if (stage === "Stage 5 (Balding from crown area)" || stage === "Stage 6 (Advanced balding)" || stage === "Heavy Hair Fall" || stage === "Coin Size Patch") {
    recommendation.kit = 'Hair Restoration Kit';
    recommendation.products = ['Gummies', 'Sinibis', 'Minoxidil 5%', 'Hair Growth Serum'];
    // if (wantsFinibis) {
    //   recommendation.products.push('Finibis');
    // }
  } else if (dandruffLevel && ['Low', 'Mild', 'Moderate', 'Severe'].includes(dandruffLevel)) {
    recommendation.kit = 'Anti-Dandruff Kit';
    recommendation.products = ['Gummies', 'Shampoo', 'Conditioner'];
    
    // Add extra products for severe cases
    if (dandruffLevel === 'Severe') {
      recommendation.products.push('Anti-Dandruff Serum');
    }
  } else {
    return res.json({ message: 'No treatment for Stage 5, consult a hair doctor' });
  }

  if (energyLevel?.toLowerCase() === 'low') {
    recommendation.products.push('Shilajit');
  }

  res.json(recommendation);
});

module.exports = router;
