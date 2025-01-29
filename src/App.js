import React, { useState } from "react";
import { motion } from "framer-motion";
import "./App.css";

function App() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
  });
  const [responses, setResponses] = useState({});

  const questionsByGender = {
    Male: [
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
    ],
    Female: [
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
    ],
  };

  const handleNext = () => {
    if (step < 2 + getGenderQuestions().length) {
      setStep((prevStep) => prevStep + 1);
    } else {
      if (responses.healthConcern === "Beard Growth") {
        alert("No questions related to Beard Growth. Please select another concern to submit.");
      } else {
        alert("Form Submitted Successfully!");
      }
    }
  };

  const handlePrevious = () => {
    if (step > 0) {
      setStep((prevStep) => prevStep - 1);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (step === 1) {
      setFormData({ ...formData, [name]: value });
    } else {
      setResponses({ ...responses, [name]: value });
    }
  };

  const getGenderQuestions = () => {
    const { gender } = formData;
    return questionsByGender[gender] || [];
  };

  const renderStageContent = () => {
    const questions = getGenderQuestions();
  
    if (step === 0) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-lg mb-4 text-center">
            Hi! I'm Noa. <br />
            I'm here to assist you with your health assessment. <br />
            May I have your details to proceed?
          </p>
          <motion.button
            onClick={handleNext}
            className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 mt-4"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Sure, let's start!
          </motion.button>
        </motion.div>
      );
    } else if (step === 1) {
      return (
        <div>
          <p className="text-lg mb-4 text-center">
            Please enter your personal details:
          </p>
          <div className="mb-4">
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full border rounded-lg px-3 py-2 mt-1"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full border rounded-lg px-3 py-2 mt-1"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full border rounded-lg px-3 py-2 mt-1"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              className="w-full border rounded-lg px-3 py-2 mt-1"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="w-full border rounded-lg px-3 py-2 mt-1"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </div>
      );
    } else if (step <= 1 + questions.length) {
      const currentQuestion = questions[step - 2];
      if (!currentQuestion) return null;
  
      // Check if we should skip the dandruff stage question
      if (currentQuestion.name === "dandruffStage" && responses.dandruff !== "Yes") {
        // Move to the next question
        return null; 
      }
  
      return (
        <div>
          <p className="text-lg mb-4">{currentQuestion.text}</p>
          {currentQuestion.img && (
            <img
              src={currentQuestion.img}
              alt="Question related illustration"
              className="w-full h-auto mb-4 rounded-lg shadow-md"
            />
          )}
          {currentQuestion.options.map((option, index) => (
            <label key={index} className="block mb-2">
              <input
                type="radio"
                name={currentQuestion.name}
                value={option}
                checked={responses[currentQuestion.name] === option}
                onChange={handleInputChange}
                className="mr-2"
              />
              {option}
            </label>
          ))}
        </div>
      );
    } else {
      // This block displays the summary only at the last step
      return (
        <div className="text-center">
          <p className="text-lg mb-4">Thank you for answering the questions!</p>
          <p className="text-md mb-2">Here's a summary of your responses:</p>
          <ul className="list-disc list-inside mb-4">
            {Object.entries(responses).map(([key, value], index) => (
              <li key={index} className="text-left">
                <strong>{key}:</strong> {value}
              </li>
            ))}
          </ul>
          <p className="text-md mb-4">You can review and submit your information now.</p>
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col items-center h-screen mt-16">
      {/* Navbar Heading */}
      <div className="bg-green-300 w-full sm:w-[600px] text-green-600 font-bold text-center text-2xl font-mono rounded-tr-xl rounded-tl-xl p-3">
        Self Assessment
      </div>

      {/* Main Box */}
      <div className="bg-white shadow-lg rounded-lg w-full sm:w-[600px]">
        {/* Navbar */}
        <div className="flex justify-around p-4 border-b">
          <button
            className={`py-2 text-gray-600 ${
              step === 1 ? "border-b-2 border-green-500" : ""
            }`}
            onClick={() => setStep(1)}
          >
            Personal Info
          </button>
          <button
            className={`py-2 text-gray-600 ${
              step === 2 ? "border-b-2 border-green-500" : ""
            }`}
            onClick={() => setStep(2)}
          >
            Problem Concern
          </button>
          <button
            className={`py-2 text-gray-600 ${
              step > 2 ? "border-b-2 border-green-500" : ""
            }`}
            onClick={() => setStep(3)}
          >
            Questions
          </button>
        </div>

        {/* Content */}
        <motion.div
          className="p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {renderStageContent()}

          {/* Navigation Buttons */}
          <div className="mt-6 flex justify-between">
            {step > 0 && (
              <button
                onClick={handlePrevious}
                className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
              >
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
            >
              {step === 1 + getGenderQuestions().length ? "Submit" : "Next"}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default App;