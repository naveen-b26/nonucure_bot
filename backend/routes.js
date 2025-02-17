const express = require('express');
const { MaleUser, FemaleUser, Recommendation } = require('./models');
const router = express.Router();

// Submit Form Route
router.post("/submit-form", async (req, res) => {
  try {
    console.log("Received Request Body:", req.body);
    const { formData, responses } = req.body;

    if (!formData || !responses) {
      return res.status(400).json({ error: "Missing form data or responses" });
    }

    const { gender } = formData;
    let savedUser;

    // Combine formData and responses
    const userData = {
      ...formData,
      ...responses
    };

    // Store in appropriate collection based on gender
    if (gender === 'Male') {
      const maleUser = new MaleUser(userData);
      savedUser = await maleUser.save();
      console.log("✅ Male User Saved:", savedUser);
    } else if (gender === 'Female') {
      const femaleUser = new FemaleUser(userData);
      savedUser = await femaleUser.save();
      console.log("✅ Female User Saved:", savedUser);
    } else {
      return res.status(400).json({ error: "Invalid gender specified" });
    }

    // Store the user ID in the store for later use
    res.status(200).json({ 
      message: "Form submitted successfully",
      userId: savedUser._id,
      gender: savedUser.gender
    });

  } catch (error) {
    console.error("❌ Error saving data to MongoDB:", error);
    res.status(500).json({ error: error.message });
  }
});

// Recommend Route
router.post('/recommend', async (req, res) => {
  try {
    const { userId, gender, hairStage, dandruff, dandruffStage, energyLevels } = req.body;
    console.log(userId,gender);
    
    // Validate user exists in appropriate collection
    const UserModel = gender === 'Male' ? MaleUser : FemaleUser;
    const user = await UserModel.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let recommendation = {};

    // Hair Stage Conditions
    if (hairStage === "Stage 2 (Hair line receding)" || hairStage === "Stage 1 (Slightly hair loss)") {
      recommendation.kit = 'Classic Kit';
      recommendation.products = ['Gummies', 'Sinibis', 'Minoxidil 5%'];
    } else if (hairStage === "Stage 3 (Developing bald spot)" || hairStage === "Stage 4 (Visible bald spot)") {
      recommendation.kit = 'Complete Hair Kit';
      recommendation.products = ['Gummies', 'Sinibis', 'Minoxidil 5%'];
    } else if (hairStage === "Stage 5 (Balding from crown area)" || 
               hairStage === "Stage 6 (Advanced balding)" || 
               hairStage === "Heavy Hair Fall" || 
               hairStage === "Coin Size Patch") {
      recommendation.kit = 'Hair Restoration Kit';
      recommendation.products = ['Gummies', 'Sinibis', 'Minoxidil 5%', 'Hair Growth Serum'];
    }

    // Dandruff Conditions
    if (dandruff === "Yes" && dandruffStage && ['Low', 'Mild', 'Moderate', 'Severe'].includes(dandruffStage)) {
      if (!recommendation.kit) {
        recommendation.kit = 'Anti-Dandruff Kit';
        recommendation.products = ['Gummies', 'Shampoo', 'Conditioner'];
      }
      if (dandruffStage === 'Severe') {
        recommendation.products.push('Anti-Dandruff Serum');
      }
    }

    // Energy Levels
    if (energyLevels === 'Medium' || energyLevels === 'Low') {
      recommendation.products.push('Shilajit');
    }

    // Ensure kit is always assigned
    if (!recommendation.kit) {
      recommendation.kit = 'General Hair Care Kit';
      recommendation.products = ['Gummies', 'Shampoo'];
    }

    // Save the recommendation
    const recommendationDoc = new Recommendation({
      userId,
      userGender: gender,
      kit: recommendation.kit,
      products: recommendation.products,
      hairStage,
      dandruffStage,
      energyLevels
    });

    const savedRecommendation = await recommendationDoc.save();
    console.log("✅ Recommendation Saved:", savedRecommendation);

    res.json({
      ...recommendation,
      recommendationId: savedRecommendation._id
    });

  } catch (error) {
    console.error("❌ Error in recommendation:", error);
    res.status(500).json({ error: error.message });
  }
});


// Get recommendations by userId and gender
router.get('/recommendations/:userId/:gender', async (req, res) => {
  try {
    const { userId, gender } = req.params;
    
    const recommendations = await Recommendation.find({ 
      userId, 
      userGender: gender 
    }).sort({ createdAt: -1 });
    
    res.json(recommendations);
  } catch (error) {
    console.error("❌ Error fetching recommendations:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
