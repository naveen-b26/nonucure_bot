const express = require('express');
const { MaleUser, FemaleUser, Recommendation, PersonalDetails } = require('./models');
const router = express.Router();

// Submit Form Route
router.post("/submit-form", async (req, res) => {
  try {
    console.log("Received Request Body:", req.body);
    const { formData, responses } = req.body;
    if (!formData || !responses) {
      return res.status(400).json({ error: "Missing form data or responses" });
    }

    const { gender, name, email, phone, age } = formData;
    let savedUser;

    // Prepare user data with personal details
    const userData = {
      name,
      email,
      phone,
      age,
      gender,
      ...responses
    };

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
    const { 
      userId, 
      gender, 
      healthConcern, 
      medicalConditions, 
      planningForBaby,
      // ...other params
    } = req.body;

    let recommendation = {};

    if (gender === 'Male') {
      switch (healthConcern) {
        case "Hair Loss":
          // Check for BP condition
          if (medicalConditions && medicalConditions.includes('High Blood Pressure (BP)')) {
            recommendation.kit = 'Anti-Dandruff Kit';
            recommendation.products = ['Minoxidil 5%', 'Biotin Gummies'];
            recommendation.warning = 'Classic kit is not recommended for BP patients';
          }
          // Check for planning baby
          else if (planningForBaby === 'Yes') {
            recommendation.kit = 'Basic Hair Growth Kit';
            recommendation.products = ['Minoxidil 5%', 'Biotin Gummies'];
            recommendation.warning = 'Finasteride is not recommended while planning for a baby';
          }
          else {
            // Normal recommendation logic
            recommendation.kit = 'Complete Hair Growth Kit';
            recommendation.products = ['Minoxidil 5%', 'Finasteride', 'Biotin Gummies'];
          }
          break;

        case "Beard Growth":
          // Similar logic for beard growth
          if (medicalConditions && medicalConditions.includes('High Blood Pressure (BP)')) {
            recommendation.kit = 'Basic Beard Growth Kit';
            recommendation.products = ['Minoxidil 5%', 'Biotin Gummies'];
          } else {
            recommendation.kit = 'Complete Beard Growth Kit';
            recommendation.products = ['Minoxidil 5%', 'Biotin Gummies'];
          }
          break;

        // ... other cases
      }
    }

    // Add warning messages if applicable
    if (medicalConditions && medicalConditions.includes('High Blood Pressure (BP)')) {
      recommendation.warning = 'Modified recommendation due to blood pressure condition';
    }

    res.json(recommendation);

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/users', async (req, res) => {
  try {
    const { startDate, endDate, startTime, endTime } = req.body;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: "Start date and end date are required" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // If time is provided, set the specific hours and minutes
    if (startTime) {
      const [hours, minutes] = startTime.split(':');
      start.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    } else {
      start.setHours(0, 0, 0, 0); // Start of day if no time specified
    }

    if (endTime) {
      const [hours, minutes] = endTime.split(':');
      end.setHours(parseInt(hours), parseInt(minutes), 59, 999);
    } else {
      end.setHours(23, 59, 59, 999); // End of day if no time specified
    }

    // Fetch Male and Female Users
    const maleUsers = await MaleUser.find({ createdAt: { $gte: start, $lte: end } });
    const femaleUsers = await FemaleUser.find({ createdAt: { $gte: start, $lte: end } });

    // Fetch Recommendations
    const maleUserIds = maleUsers.map(user => user._id);
    const femaleUserIds = femaleUsers.map(user => user._id);
    
    const maleRecommendations = await Recommendation.find({ userId: { $in: maleUserIds } });
    const femaleRecommendations = await Recommendation.find({ userId: { $in: femaleUserIds } });

    res.status(200).json({
      maleUsers,
      femaleUsers,
      maleRecommendations,
      femaleRecommendations
    });
  } catch (error) {
    console.error("❌ Error fetching users and recommendations:", error);
    res.status(500).json({ error: error.message });
  }
});



module.exports = router;
