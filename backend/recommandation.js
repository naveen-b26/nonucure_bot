const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
  stage: String, // Use String for hair stages
  dandruffLevel: String,
  energyLevel: String,
  wantsFinibis: Boolean
});

const User = mongoose.model('User', userSchema);

app.post('/recommend', async (req, res) => {
  const { stage, dandruffLevel, energyLevel, wantsFinibis } = req.body;
  let recommendation = {};

  // Adjusted stage logic based on the string options you provided
  if (stage === "Stage 1 (Slightly hair loss)" || stage === "Stage 2 (Hair line receding)") {
    recommendation.kit = 'Classic Kit';
    recommendation.products = ['Gummies', 'Sinibis', 'Minoxidil 5%'];
  } else if (stage === "Stage 3 (Developing bald spot)" || stage === "Stage 4 (Visible bald spot)") {
    recommendation.kit = 'Complete Hair Kit';
    recommendation.products = ['Gummies', 'Sinibis', 'Minoxidil 5%'];
    if (wantsFinibis) {
      recommendation.products.push('Finibis');
    }
  } else if (stage === "Stage 5 (Balding from crown area)" || stage === "Stage 6 (Advanced balding)" || stage === "Heavy Hair Fall" || stage === "Coin Size Patch") {
    recommendation.kit = 'Hair Restoration Kit';
    recommendation.products = ['Gummies', 'Sinibis', 'Minoxidil 5%', 'Hair Growth Serum'];
    if (wantsFinibis) {
      recommendation.products.push('Finibis');
    }
  } else if (dandruffLevel) {
    recommendation.kit = 'Anti-Dandruff Kit';
    recommendation.products = ['Gummies', 'Shampoo', 'Conditioner'];
  } else {
    return res.json({ message: 'No treatment for Stage 5, consult a hair doctor' });
  }

  if (energyLevel === 'low') {
    recommendation.products.push('Shilajit');
  }

  res.json(recommendation);
});

app.listen(5000, () => console.log('Server running on port 5000'));
