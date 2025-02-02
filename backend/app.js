const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { User, Answer } = require('./models.js'); // Import models
const app = express();
const dotenv = require("dotenv");
dotenv.config();

const link=process.env.MONGO_URI
app.use(cors());
app.use(express.json()); // For parsing application/json

// Connect to MongoDB
mongoose.connect(`${link}/chatbot_nonu`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});

// POST endpoint to submit the form
app.post('/submit-form', async (req, res) => {
  try {
    const { formData, responses } = req.body;

    if (!formData || !responses) {
      return res.status(400).json({ error: 'Missing form data or responses' });
    }

    // Save user data
    const user = new User(formData);
    const savedUser = await user.save();

    // Save responses with userId reference
    const answer = new Answer({ userId: savedUser._id, ...responses });
    await answer.save();

    res.status(200).json({ message: 'Form submitted successfully' });
  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
