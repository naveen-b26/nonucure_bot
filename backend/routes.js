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
router.post("/recommend", async (req, res) => {
  const { stage, dandruffLevel, energyLevel, wantsFinibis } = req.body;
  let recommendation = {};

  try {
    if (stage === 1 || stage === 2) {
      recommendation.kit = 'Classic Kit';
      recommendation.products = ['Gummies', 'Sinibis', 'Minoxidil 5%'];
    } else if (stage === 3 || stage === 4) {
      recommendation.kit = 'Complete Hair Kit';
      recommendation.products = ['Gummies', 'Sinibis', 'Minoxidil 5%'];
      if (wantsFinibis) {
        recommendation.products.push('Finibis');
      }
    } else if (dandruffLevel) {
      recommendation.kit = 'Anti-Dandruff Kit';
      recommendation.products = ['Gummies', 'Shampoo', 'Conditioner'];
    } else if (stage === 1 || stage === 2) {
      recommendation.kit = 'Active Hair Growth Kit';
      recommendation.products = ['Gummies', 'Shampoo', 'Hair Growth Serum'];
    } else {
      return res.json({ message: 'No treatment for Stage 5, consult a hair doctor' });
    }

    if (energyLevel === 'low') {
      recommendation.products.push('Shilajit');
    }

    res.json(recommendation);
  } catch (error) {
    console.error("Error generating recommendation:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
