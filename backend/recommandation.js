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
  stage: Number,
  dandruffLevel: String,
  energyLevel: String,
  wantsFinibis: Boolean
});

const User = mongoose.model('User', userSchema);

app.post('/recommend', async (req, res) => {
  const { stage, dandruffLevel, energyLevel, wantsFinibis } = req.body;
  let recommendation = {};

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
});

app.listen(5000, () => console.log('Server running on port 5000'));
