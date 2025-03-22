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
    const { userId, gender, healthConcern, hairStage, dandruff, dandruffStage,
      energyLevels, naturalHair, goal, hairFall, mainConcern } = req.body;
      console.log("rr",healthConcern);
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Validate user exists in appropriate collection
    const UserModel = gender === 'Male' ? MaleUser : FemaleUser;
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let recommendation = {};

    // First check gender, then handle specific cases
    if (gender === 'Male') {
      switch (healthConcern) {
        case "Sexual Health":
          recommendation.kit = 'Sexual Health Kit';
          recommendation.products = ['Shilajit'];
          recommendation.description = 'Shilajit is known to boost energy levels and improve overall vitality.';
          break;

        case "Beard Growth":
          recommendation.kit = 'Beard Growth Kit';
          recommendation.products = ['Minoxidil 5%', 'Biotin Gummies'];
          recommendation.description = 'This combination helps stimulate beard growth and provides essential nutrients.';
          break;

        case "Hair Loss":
          // Handle male hair loss stages
          if (hairStage === "Stage 2 (Hair line receding)" || hairStage === "Stage 1 (Slightly hair loss)") {
            recommendation.kit = 'Classic Kit';
            recommendation.products = ['Gummies', 'Sinibis', 'Minoxidil 5%'];
          } else if (hairStage === "Stage 3 (Developing bald spot)" || hairStage === "Stage 4 (Visible bald spot)") {
            recommendation.kit = 'Complete Hair Kit';
            recommendation.products = ['Gummies', 'Sinibis', 'Minoxidil 5%'];
          } else if (["Stage 5 (Balding from crown area)", "Stage 6 (Advanced balding)", "Heavy Hair Fall", "Coin Size Patch"].includes(hairStage)) {
            recommendation.kit = 'Hair Restoration Kit';
            recommendation.products = ['Gummies', 'Sinibis', 'Minoxidil 5%', 'Hair Growth Serum'];
          }

          // Handle dandruff conditions
          if (dandruff === "Yes" && dandruffStage && ["Low", "Mild", "Moderate", "Severe"].includes(dandruffStage)) {
            if (!recommendation.kit) {
              recommendation.kit = "Anti-Dandruff Kit";
              recommendation.products = ["Gummies", "Shampoo", "Conditioner"];
            }
            if (dandruffStage === "Severe") {
              recommendation.products.push("Anti-Dandruff Serum");
            }
          }

          // Handle energy levels
          if (energyLevels === "Medium" || energyLevels === "Low") {
            recommendation.products.push("Shilajit");
          }
          break;

        default:
          return res.status(400).json({ message: "Invalid health concern specified for male" });
      }
    } else if (gender === 'Female') {
      // Handle female-specific cases
      if (goal === "Control hair fall") {
        recommendation.kit = "Active Hair Growth Kit";
        recommendation.products = ["Gummies", "Shampoo", "Hair Growth Serum"];
      } else if (goal === "Regrow Hair") {
        // if (["Hair thinning", "Less volume on sides"].includes(healthConcern)) {
        if( healthConcern === "Hair thinning" || healthConcern === "Less volume on sides") {
          recommendation.kit = "Classic Kit";
          recommendation.products = ["Gummies", "Sinibis", "Minoxidil 5%"];
        } 
        // else if (["Coin size patches", "Medium widening"].includes(healthConcern)) {
        else if(healthConcern === "Coin size patches" || healthConcern === "Medium widening"){ 
        recommendation.kit = "Complete Kit";
          recommendation.products = ["Gummies", "Sinibis", "Minoxidil 5%"];
        } else if (healthConcern === "Advanced widening") {
          return res.status(400).json({ message: "Consult a hair doctor for advanced widening." });
        }
      } else {
        return res.status(400).json({ message: "Invalid goal specified for female" });
      }
    } else {
      return res.status(400).json({ message: "Invalid gender specified" });
    }

    // const existingRecommendation = await Recommendation.findOne({ userId, healthConcern });

    // if (existingRecommendation) {
    //   return res.status(409).json({
    //     message: "Recommendation already exists",
    //     existingRecommendation
    //   });
    // }

    // Save recommendation
    const recommendationDoc = new Recommendation({
      userId,
      userGender: gender,
      healthConcern,
      kit: recommendation.kit,
      products: recommendation.products,
      description: recommendation.description,
      ...(healthConcern === 'Hair Loss' && {
        hairStage,
        dandruffStage,
        energyLevels
      })
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

router.post('/users', async (req, res) => {
  try {
    const { startDate, endDate } = req.body;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: "Start date and end date are required" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // Ensure end of the day inclusion

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
