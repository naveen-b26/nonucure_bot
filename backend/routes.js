const express = require('express');
const { MaleUser, FemaleUser, Recommendation, PersonalDetails } = require('./models');
const router = express.Router();

// const PRODUCT_KITS = {
//   'Classic Kit': {
//     products: ['Minoxidil 5%', 'Biotin Gummies','Sinibis'],
//     description: 'Basic hair loss treatment without Finibis.',
//     url: 'https://nonucare.com/products/the-classic-hair-kit?_pos=2&_sid=77a3f7455&_ss=r'
//   },
//   'Complete Hair Growth Kit': {
//     products: ['Minoxidil 5%', 'Biotin Gummies', 'Sinibis','Finasteride'],
//     description: 'Advanced hair loss treatment with Finibis.',
//     url: 'https://nonucare.com/products/the-complete-hair-kit?_pos=1&_sid=9a06b0998&_ss=r'
//   },
//   'Anti-Dandruff Kit': {
//     products: ['Ketoconazole 1% Shampoo', 'Anti Dandruff Conditioner', 'Biotin Gummies'],
//     description: 'Focus on treating dandruff before addressing hair loss.',
//     url: 'https://nonucare.com/products/anti-dandruff-kit?_pos=1&_sid=970e5b4fb&_ss=r'
//   },
//   'Mothers Hair Growth Kit': {
//     products: ['Biotin Gummies', 'Shampoo', 'Hair Growth Serum'],
//     description: 'Hair care kit for new mothers.',
//     url: 'https://nonucare.com/products/mother-s-hair-growth-kit?_pos=1&_psq=mothers+hair+grow&_ss=e&_v=1.0'
//   },
// };

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

    // Get current date and time
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toTimeString().split(' ')[0];

    // Prepare user data with personal details and date/time
    const userData = {
      name,
      email,
      phone,
      age,
      gender,
      date,
      time,
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
// Assuming PRODUCT_KITS is defined globally or passed as a constant.
// Example structure for PRODUCT_KITS (add/modify as per your actual implementation):
const PRODUCT_KITS = {
  'Beard Growth Kit': { products: ['Minoxidil 5%', 'Biotin Gummies'], description: 'Standard beard growth kit.', url: '/beard-growth-kit' },
  'Anti-Dandruff Kit': { products: ['Ketoconazole 1% Shampoo', 'Anti Dandruff Conditioner', 'Biotin Gummies'], description: 'Kit to combat dandruff.', url: 'https://nonucare.com/products/anti-dandruff-kit?_pos=1&_sid=970e5b4fb&_ss=r' },
  'Complete Hair Growth Kit': { products: ['Minoxidil 5%', 'Biotin Gummies', 'Sinibis', 'Finasteride'], description: 'Comprehensive kit for significant hair growth.', url: 'https://nonucare.com/products/the-complete-hair-kit?_pos=1&_sid=9a06b0998&_ss=r' },
  'Classic Kit': { products: ['Minoxidil 5%', 'Biotin Gummies', 'Sinibis'], description: 'Classic kit for hair growth and maintenance.', url: 'https://nonucare.com/products/the-classic-hair-kit?_pos=2&_sid=77a3f7455&_ss=r' },
  'Mothers Hair Growth Kit': { products: ['Biotin Gummies', 'Shampoo', 'Hair Growth Serum'], description: 'Specialized kit for post-pregnancy hair care, focusing on gentle nourishment and strengthening.', url: 'https://nonucare.com/products/mother-s-hair-growth-kit?_pos=1&_psq=mothers+hair+grow&_ss=e&_v=1.0' },
  'Active Hair Growth Kit': { products: ['Active Growth Serum', 'Ketoconazole 1% Shampoo', 'Biotin Gummies'], description: 'Kit designed for active hair regrowth and promoting scalp health.', url: 'https://nonucare.com/products/active-hair-growth-kit?_pos=1&_psq=active&_ss=e&_v=1.0' },

};

router.post('/recommend', async (req, res) => {
  try {
    const {
      userId,
      gender,
      healthConcern,
      hairStage,
      dandruff, // 'Yes' or 'No'
      dandruffStage, // 'Mild', 'Moderate', 'Severe' (if dandruff is 'Yes')
      energyLevels,
      naturalHair,
      goal, // 'Control hair fall', 'Regrow Hair'
      hairFall,
      mainConcern,
      medicalConditions,
      planningForBaby, // 'Recently had a baby (< 1 year)', 'Trying to conceive', 'No'
    } = req.body;
    console.log("Received Recommendation Request Body:", req.body);

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Validate user exists
    const UserModel = gender === 'Male' ? MaleUser : FemaleUser; // Assuming MaleUser and FemaleUser models
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let recommendation = {};
    let kitDetails; // Variable to hold details from PRODUCT_KITS

    // Male-specific recommendations
    if (gender === 'Male') {
      switch (healthConcern) {
        case 'Beard Growth':
          recommendation.kit = 'Beard Growth Kit';
          recommendation.products = ['Minoxidil 5%', 'Biotin Gummies'];
          recommendation.description = 'Beard growth support kit.';
          break;

        case 'Hair Loss':
          if (hairStage === 'Stage 6 (Advanced balding)' || hairStage === 'Heavy Hair Fall') {
            recommendation.needsDoctor = true;
            recommendation.message = 'Sorry, we are not able to handle that worse situations of the hairfall. Please consult the nearest dermatologist for proper medical attention.';
          } else if (['Stage 1 (Slightly hair loss)', 'Stage 2 (Hair line receding)'].includes(hairStage) &&
            dandruff === 'Yes' &&
            ['Moderate', 'Severe'].includes(dandruffStage)) {
            recommendation.kit = 'Anti-Dandruff Kit';
            recommendation.products = ['Ketoconazole 1% Shampoo', 'Anti-Dandruff Conditioner', 'Biotin Gummies'];
            recommendation.description = 'Focus on treating dandruff before addressing hair loss.';
            recommendation.warning = dandruffStage === 'Severe' ? 'Consider consulting a dermatologist alongside using this kit.' : null;
          } else if (medicalConditions?.includes('High Blood Pressure (BP)')) {
            recommendation.kit = 'Classic Kit';
            recommendation.products = ['Minoxidil 5%', 'Biotin Gummies'];
            recommendation.warning = 'Complete Kit not recommended due to BP condition';
          } else if (planningForBaby === 'Yes') { // For male, "Yes" implies planning with a partner for a baby
            recommendation.kit = 'Classic Kit';
            recommendation.products = ['Minoxidil 5%', 'Biotin Gummies'];
            recommendation.warning = 'Complete Kit not recommended while planning for a baby';
          } else {
            // Offer Complete Kit for stages 3-4, Classic Kit for stages 1-2
            if (['Stage 3 (Developing bald spot)', 'Stage 4 (Visible bald spot)'].includes(hairStage)) {
              kitDetails = PRODUCT_KITS['Complete Hair Growth Kit'];
              recommendation = {
                kit: 'Complete Hair Growth Kit',
                products: kitDetails.products,
                description: kitDetails.description,
                url: kitDetails.url
              };
            } else {
              kitDetails = PRODUCT_KITS['Classic Kit'];
              recommendation = {
                kit: 'Classic Kit',
                products: kitDetails.products,
                description: kitDetails.description,
                url: kitDetails.url
              };
            }
          }

          // Add recommendation note based on dandruff
          if (dandruff === 'Yes') {
            recommendation.note = 'Consider using anti-dandruff shampoo alongside your kit.';
          }
          break;

        default:
          return res.status(400).json({ message: 'Invalid health concern specified for male' });
      }
    }
    // Female-specific recommendations (UPDATED LOGIC)
    else if (gender === 'Female') {
      // --- Priority 1: Recently had a baby (< 1 year) ---
      if (planningForBaby === 'Recently had a baby (< 1 year)') {
        if (hairStage === 'Stage 4 (Visible scalp)' || (hairStage==='Stage 5 (Advanced thinning)' && dandruff==='No')) {
          kitDetails = PRODUCT_KITS['Mothers Hair Growth Kit'];
          recommendation = {
            kit: 'Mothers Hair Growth Kit',
            products: kitDetails.products,
            description: kitDetails ? kitDetails.description : 'Specialized kit for post-pregnancy hair care, focusing on gentle nourishment and strengthening.',
            url: kitDetails ? kitDetails.url : null
          };
        } else {
          kitDetails = PRODUCT_KITS['Active Hair Growth Kit'];
          recommendation = {
            kit: 'Active Hair Growth Kit',
            products: kitDetails ? kitDetails.products : ['Active Growth Serum', 'Ketoconazole 1% Shampoo', 'Biotin Gummies'],
            description: kitDetails ? kitDetails.description : 'Supports hair growth while planning for a baby.',
            url: kitDetails ? kitDetails.url : null
          };
        }
      }
      // --- Priority 2: Trying to conceive / Planning for pregnancy ---
      else if (planningForBaby === 'Planning for pregnancy') {
        kitDetails = PRODUCT_KITS['Active Hair Growth Kit'];
        recommendation = {
          kit: 'Active Hair Growth Kit',
          products: kitDetails ? kitDetails.products : ['Active Growth Serum', 'Ketoconazole 1% Shampoo', 'Biotin Gummies'],
          description: kitDetails ? kitDetails.description : 'Supports hair growth while planning for pregnancy.',
          url: kitDetails ? kitDetails.url : null
        };
      }
      // --- Priority 3: Dandruff (when NOT planning for baby or recently had one) ---
      else if (dandruff === 'Yes' && planningForBaby === 'None') { // Explicitly check for 'None' here
        if (dandruffStage === 'Severe') {
          // Mild or Moderate dandruff, and planningForBaby is 'None'
          // THIS IS THE CHANGE: Recommends Classic Kit as per notes "Excess + None = Classic Kit"
          kitDetails = PRODUCT_KITS['Classic Kit'];
          recommendation = {
            kit: 'Classic Kit',
            products: kitDetails ? kitDetails.products : ['Minoxidil 5%', 'Biotin Gummies', 'Sinibis'],
            description: kitDetails ? kitDetails.description : 'Classic kit for managing excess dandruff.',
            url: kitDetails ? kitDetails.url : null
          };
        }
      }
      // --- Priority 4: No dandruff, no pregnancy conditions ---
      else if (dandruff === 'No' && planningForBaby === 'None') {
        kitDetails = PRODUCT_KITS['Active Hair Growth Kit'];
        recommendation = {
          kit: 'Active Hair Growth Kit',
          products: kitDetails ? kitDetails.products : ['Active Growth Serum', 'Ketoconazole 1% Shampoo', 'Biotin Gummies'],
          description: kitDetails ? kitDetails.description : 'Basic hair care for general maintenance.',
          url: kitDetails ? kitDetails.url : null
        };
      }
      // --- Fallback for any other conditions (e.g., unexpected planningForBaby values or other health concerns for female) ---
      else {
        kitDetails = PRODUCT_KITS['Active Hair Growth Kit'];
        recommendation = {
          kit: 'Active Hair Growth Kit',
          products: kitDetails ? kitDetails.products : ['Active Growth Serum', 'Ketoconazole 1% Shampoo', 'Biotin Gummies'],
          description: kitDetails ? kitDetails.description : 'General hair care kit for various conditions.',
          url: kitDetails ? kitDetails.url : null
        };
      }

      // Ensure description is set, using a default if not already specified
      recommendation.description = recommendation.description || 'Personalized female hair care kit.';
    } else {
      return res.status(400).json({ message: 'Invalid gender specified' });
    }

    // Save to DB
    const recommendationDoc = new Recommendation({ // Assuming Recommendation model
      userId,
      userGender: gender,
      healthConcern,
      kit: recommendation.kit,
      products: recommendation.products,
      description: recommendation.description,
      ...(healthConcern === 'Hair Loss' && { // Only save these fields if healthConcern is 'Hair Loss'
        hairStage,
        dandruffStage,
        energyLevels
      }),
      // Include relevant female-specific inputs for better tracking
      planningForBaby: planningForBaby,
      dandruff: dandruff,
    });

    const savedRecommendation = await recommendationDoc.save();
    console.log('✅ Recommendation Saved:', savedRecommendation);

    res.json({
      ...recommendation,
      recommendationId: savedRecommendation._id
    });

  } catch (error) {
    console.error('❌ Error in recommendation:', error);
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
