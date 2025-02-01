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
  const { formData, responses } = req.body;

  try {
    // Save user data first
    const user = new User({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      age: formData.age,
      gender: formData.gender,
    });

    const savedUser = await user.save();

    // Now save answers data with the userId reference
    const answers = new Answer({
      userId: savedUser._id, // Reference to the saved user
      ...responses,
    });

    await answers.save();

    res.status(200).json({ message: 'Form submitted successfully' });
  } catch (error) {
    console.error('Error submitting form data:', error);
    res.status(500).json({ error: 'Failed to submit form' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
