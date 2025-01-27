import React, { useState } from "react";
import "./App.css";

function App() {
  const [step, setStep] = useState(1);
  const [selectedConcern, setSelectedConcern] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
  });
  const [responses, setResponses] = useState({});
  const [errors, setErrors] = useState({});
  const [animate, setAnimate] = useState(false); // Track animation

  const concerns = [
    { id: 1, label: "Hair Loss", icon: "👨‍🦲" },
    { id: 2, label: "Sexual Health", icon: "❤️" },
  ];

  const questions = {
    "Hair Loss": [
      {
        text: "Please select your hair stage:",
        name: "hairStage",
        options: [
          "Stage 1 (Slightly hair loss)",
          "Stage 2 (Hair line receding)",
          "Stage 3 (Developing bald spot)",
          "Stage 4 (Visible bald spot)",
          "Stage 5 (Balding from crown area)",
          "Stage 6 (Advanced balding)",
        ],
      },
      {
        text: "How long have you experienced hair loss?",
        name: "duration",
        options: ["Less than 1 year", "1-2 years", "2-5 years", "More than 5 years"],
      },
    ],
    "Sexual Health": [
      {
        text: "Are you currently experiencing any symptoms?",
        name: "symptoms",
        options: ["Yes", "No"],
      },
      {
        text: "Have you consulted a doctor for this before?",
        name: "consultedDoctor",
        options: ["Yes", "No"],
      },
    ],
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setResponses({ ...responses, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Valid email is required";
    if (!formData.phone.trim() || !/^\d{10}$/.test(formData.phone))
      newErrors.phone = "Valid phone number is required (10 digits)";
    if (!formData.age.trim() || parseInt(formData.age) < 18)
      newErrors.age = "Age must be 18 or older";
    if (!formData.gender.trim()) newErrors.gender = "Gender is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    setAnimate(true); // Trigger animation
    setTimeout(() => {
      setAnimate(false); // Reset animation
      if (step === 1 && validateForm()) setStep(2);
      else if (step === 3) {
        const totalQuestions = questions[selectedConcern].length;
        if (currentQuestionIndex < totalQuestions - 1) {
          setCurrentQuestionIndex((prev) => prev + 1);
        } else {
          alert("Form Submitted!");
          console.log("Form Data:", formData);
          console.log("Responses:", responses);
        }
      } else if (step < 3) {
        setStep(step + 1);
      }
    }, 500);
  };

  const handlePrevious = () => {
    setAnimate(true);
    setTimeout(() => {
      setAnimate(false);
      if (step === 3 && currentQuestionIndex > 0) {
        setCurrentQuestionIndex((prev) => prev - 1);
      } else if (step > 1) {
        setStep(step - 1);
      }
    }, 500);
  };

  const handleTabClick = (targetStep) => {
    if (targetStep < step) {
      setAnimate(true);
      setTimeout(() => {
        setAnimate(false);
        setStep(targetStep);
      }, 500);
    }
  };

  const renderStageContent = () => {
    if (step === 1) {
      return (
        <div>
          <p className="text-lg mb-4">Please enter your personal details:</p>
          <div className="mb-4">
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 mt-1"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 mt-1"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 mt-1"
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 mt-1"
            />
            {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 mt-1"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
          </div>
        </div>
      );
    } else if (step === 2) {
      return (
        <div>
          <p className="text-lg mb-4">Please select your health concern:</p>
          {concerns.map((concern) => (
            <button
              key={concern.id}
              onClick={() => {
                setSelectedConcern(concern.label);
                setStep(3);
              }}
              className="flex items-center justify-start border p-4 rounded-lg hover:bg-blue-100"
            >
              <span className="text-2xl mr-3">{concern.icon}</span>
              <span className="text-lg font-medium">{concern.label}</span>
            </button>
          ))}
        </div>
      );
    } else if (step === 3) {
      const currentQuestions = questions[selectedConcern];
      const currentQuestion = currentQuestions[currentQuestionIndex];
      return (
        <div>
          <p className="mb-4">{currentQuestion.text}</p>
          {currentQuestion.options.map((option, idx) => (
            <label key={idx} className="inline-flex items-center mr-4">
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
    }
  };

  return (
    <div className="flex flex-col items-center h-screen mt-16">
  <span className="bg-green-300 w-full sm:w-[600px] text-green-600 font-bold text-center text-2xl font-mono rounded-tr-xl rounded-tl-xl p-3">
    Self Assessment
  </span>
  <div className="bg-white shadow-[0px_35px_60px_15px_rgb(89,236,192,0.2)] rounded-lg w-full sm:w-[600px] p-6 relative overflow-hidden transition-all-200 ease-in-out">
    {/* Tab Navigation */}
    <div className="flex justify-around mb-4 border-b pb-2 mt-3">
    {[1, 2, 3].map((tab) => (
  <button
    key={tab}
    onClick={() => handleTabClick(tab)}
    className={`${
      step === tab
        ? "text-green-800 border-b-2 border-green-400"
        : "text-gray-500"
    } pb-1`}
  >
    {tab === 1 && "Personal Info"}
    {tab === 2 && "Type of Concern"}
    {tab === 3 && "Questions"}
  </button>
))}

    </div>

    {/* Form Content with Animation */}
    <div
      className={`transition-transform duration-300 ${
        animate ? "transform -translate-x-full opacity-0" : "opacity-100"
      }`}
    >
      {renderStageContent()}
    </div>

    {/* Navigation Buttons */}
    <div className="mt-6 flex flex-col sm:flex-row justify-between gap-2 sm:gap-4">
      {step > 1 && (
        <button
          onClick={handlePrevious}
          className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 w-full sm:w-auto"
        >
          Back
        </button>
      )}
      <button
        onClick={handleNext}
        className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 w-full sm:w-auto"
      >
        {step === 3 && currentQuestionIndex === questions[selectedConcern]?.length - 1
          ? "Submit"
          : "Next"}
      </button>
    </div>
  </div>
</div>

        )};

export default App;
