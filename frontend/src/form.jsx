"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import useStore from "./store";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import male from "./pics/male.png";
import female from "./pics/female.png";
import hairLoss from "./pics/hairloss.png";
import bg from "./pics/beardGrowth.png";
import s1 from "./pics/stage-1.png";
import s2 from "./pics/stage-2.png";
import s3 from "./pics/stage-3.png";
import s4 from "./pics/stage-4.png";
import s5 from "./pics/stage-5.png";
import s6 from "./pics/stage-6.png";
import s7 from "./pics/stage-7.png";
import stH from "./pics/straightHair.jpg";
import wH from "./pics/wavyHair.jpg";
import cH from "./pics/curlyHair.jpg";
import coH from "./pics/coilyHair.png";
import dn from "./pics/dandruffNo.png";
import dy from "./pics/dandruffYes.jpg";
import bs from "./pics/baldSpots.png";
import thin from "./pics/thinning.png";
import bot from "./pics/botImage.jpg";
import ht from "./pics/hairThinning.jpg";
import lV from "./pics/lessVolume.png";
import mW from "./pics/MWidening.png";
import aW from "./pics/AWidening.png";
import cP from "./pics/Cpatches.png";
import logo from "./pics/nonu_care_logo.jpeg";
function Form() {
  const { setUserId, formData, setFormData, responses, setResponses } =
    useStore();
  const navigate = useNavigate();
  const [currentInput, setCurrentInput] = useState("");
  const [step, setStep] = useState(0);
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([
    {
      type: "bot",
      content: "I'm here to assist you with your health assessment.",
    },
    {
      type: "bot",
      content: "May I have your details to proceed?",
      showStartButton: true,
    },
  ]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (step > 0 && Object.keys(formData).length > 0) {
        e.preventDefault();
        e.returnValue = "You have unsaved changes. Do you want to leave?";

        // Save the current progress
        const existingUserId = localStorage.getItem("userId");
        if (!existingUserId) {
          axios
            .post(`https://nonucure-bot.vercel.app/api/submit-form`, {
              formData,
              responses,
            })
            .then((response) => {
              localStorage.setItem("userId", response.data.userId);
              setUserId(response.data.userId);
            })
            .catch((error) => {
              console.error("Error saving progress:", error);
            });
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [step, formData, responses, setUserId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleStartClick = () => {
    setMessages((prev) => [
      ...prev,
      { type: "user", content: "Sure, let's start!" },
      {
        type: "bot",
        content: "What's your name?",
        input: true,
        name: "name",
        placeholder: "Enter your name",
      },
    ]);
    setStep(1);
  };
  const getNextQuestion = (name, value) => {
    if (step <= 5) {
      switch (name) {
        case "name":
          return {
            content: "What's your email?",
            input: true,
            name: "email",
            placeholder: "Enter your email",
          };
        case "email":
          return {
            content: "What's your phone number?",
            input: true,
            name: "phone",
            placeholder: "Enter your phone number",
          };
        case "phone":
          return {
            content: "What's your age?",
            input: true,
            name: "age",
            placeholder: "Enter your age",
            type: "bot",
          };
        case "age":
          return {
            content: "Please select your gender:",
            input: true,
            name: "gender",
            options: [
              { label: "Male", image: male },
              { label: "Female", image: female },
            ],
          };
        case "gender":
          if (value === "Male") {
            return {
              content: "What's your primary health concern?",
              input: true,
              name: "healthConcern",
              options: [
                { label: "Hair Loss", image: hairLoss },
                { label: "Beard Growth", image: bg },
              ],
            };
          } else {
            return {
              content: "What's your primary health concern?",
              input: true,
              name: "healthConcern",
              options: [
                { label: "Hair thinning", image: ht },
                { label: "Coin size patches", image: cP },
                { label: "Medium widening", image: mW },
                { label: "Advanced widening", image: aW },
                { label: "Less volume on sides", image: lV },
              ],
            };
          }
        default:
          return null;
      }
    } else if (name === "healthConcern") {
      if (value === "Hair Loss") {
        if (formData.gender === "Male") {
          return {
            content: "Please select your hair stage:",
            input: true,
            name: "hairStage",
            options: [
              { label: "Stage 1 (Slightly hair loss)", image: s1 },
              { label: "Stage 2 (Hair line receding)", image: s2 },
              { label: "Stage 3 (Developing bald spot)", image: s3 },
              { label: "Stage 4 (Visible bald spot)", image: s4 },
              { label: "Stage 5 (Balding from crown area)", image: s5 },
              { label: "Stage 6 (Advanced balding)", image: s6 },
              { label: "Heavy Hair Fall", image: s7 },
            ],
          };
        }
      } else {
        return {
          content: "What does your hair look like naturally?",
          input: true,
          name: "naturalHair",
          options: [
            { label: "Straight", image: stH },
            { label: "Curly", image: cH },
            { label: "Wavy", image: wH },
            { label: "Coily", image: coH },
          ],
        };
      }
    } else if (name === "hairStage") {
      return {
        content: "Do you have dandruff?",
        input: true,
        name: "dandruff",
        options: [
          { label: "Yes", image: dy },
          { label: "No", image: dn },
        ],
      };
    } else if (name === "dandruff" && value === "Yes") {
      return {
        content: "Select your dandruff stage:",
        input: true,
        name: "dandruffStage",
        options: [
          { label: "Low" },
          { label: "Mild" },
          { label: "Moderate" },
          { label: "Severe" },
        ],
      };
    } else if (name === "dandruff" || name === "dandruffStage") {
      return {
        content: "Are you experiencing hair thinning or bald spots?",
        input: true,
        name: "thinningOrBaldSpots",
        options: [
          { label: "thinning only", image: thin },
          { label: "bald spots only", image: bs },
          { label: "Yes, both" },
          { label: "No" },
          { label: "I'm not sure" },
        ],
      };
    } else if (name === "thinningOrBaldSpots") {
      return {
        content: "What do you describe about energy levels:",
        input: true,
        name: "energyLevels",
        options: [{ label: "Low" }, { label: "Moderate" }, { label: "High" }],
      };
    } else if (name === "naturalHair") {
      return {
        content: "What is your current goal?",
        input: true,
        name: "goal",
        options: [{ label: "Control hair fall" }, { label: "Regrow Hair" }],
      };
    } else if (name === "goal") {
      return {
        content: "Do you feel more hair fall than usual?",
        input: true,
        name: "hairFall",
        options: [
          { label: "Yes, extreme" },
          { label: "Mild" },
          { label: "No" },
        ],
      };
    } else if (name === "hairFall" || name === "energyLevels") {
      return {
        content: "Have you experienced any of these in the last year?",
        input: true,
        name: "severeIllness",
        options: [
          { label: "Severe illness (e.g., dengue, malaria, typhoid)" },
          { label: "Malaria" },
          { label: "Heavy weight (fall/gain)" },
          { label: "No" },
        ],
      };
    } else if (name === "severeIllness") {
      return {
        content: "Is hair loss genetic in your family?",
        input: true,
        name: "hairLossGenetic",
        options: [{ label: "Yes" }, { label: "No" }],
      };
    } else if (name === "hairLossGenetic") {
      return {
        content: "Do you feel stressed?",
        input: true,
        name: "stressLevel",
        options: [
          { label: "Yes" },
          { label: "No" },
          { label: "Moderate" },
          { label: "High" },
        ],
      };
    } else if (name === "stressLevel") {
      return {
        content: "How well do you sleep?",
        input: true,
        name: "sleepQuality",
        options: [
          { label: "6 to 8 hours of uninterrupted sleep" },
          { label: "Disturbed sleep" },
          { label: "Difficulty falling or staying asleep" },
        ],
      };
    } else if (name === "sleepQuality" && formData.gender === "Male") {
      return {
        content: "Are you planning for a baby?",
        input: true,
        name: "planningForBaby",
        options: [{ label: "Yes" }, { label: "No" }],
      };
    }
    return null;
  };

  const handleInputSubmit = async (name, value) => {
    // Validation checks
    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setMessages((prev) => [
          ...prev,
          { type: "bot", content: "Please enter a valid email address." },
          {
            type: "bot",
            content: "What's your email?",
            input: true,
            name: "email",
            placeholder: "Enter your email",
          },
        ]);
        return;
      }
    }

    if (name === "phone") {
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(value)) {
        setMessages((prev) => [
          ...prev,
          {
            type: "bot",
            content: "Please enter a valid 10-digit phone number.",
          },
          {
            type: "bot",
            content: "What's your Phone number?",
            input: true,
            name: "phone",
            placeholder: "Enter your Phone number",
          },
        ]);
        return;
      }
    }

    if (name === "age") {
      const age = Number.parseInt(value);
      if (isNaN(age) || age < 16 || age > 90) {
        setMessages((prev) => [
          ...prev,
          { type: "bot", content: "Please enter a valid Age." },
          {
            type: "bot",
            content: "What's your age?",
            input: true,
            name: "age",
            placeholder: "Enter your age",
          },
        ]);
        return;
      }
    }

    // Check for advanced hair loss stages
    if (
      name === "hairStage" &&
      (value === "Stage 6 (Advanced balding)" || value === "Heavy Hair Fall")
    ) {
      setMessages((prev) => [
        ...prev,
        { type: "user", content: value },
        {
          type: "bot",
          content:
            "Sorry, we are not able to handle that worse situations of the hairfall. Please consult the nearest dermatologist for proper medical attention.",
          actions: [
            {
              label: "Change Selection",
              onClick: () => {
                // Remove the last two messages (user selection and bot response)
                setMessages((prev) => prev.slice(0, -2));
                // Show the hair stage question again
                const hairStageQuestion = getNextQuestion(
                  "healthConcern",
                  "Hair Loss"
                );
                if (hairStageQuestion) {
                  setMessages((prev) => [
                    ...prev,
                    { type: "bot", ...hairStageQuestion },
                  ]);
                }
              },
            },
            {
              label: "Restart Assessment",
              onClick: () => window.location.reload(),
            },
            {
              label: "Thanks for your solution",
              onClick: () =>
                setMessages((messages) => [
                  ...messages,
                  { type: "user", content: "Thanks for your solution" },
                ]),
            },
          ],
        },
      ]);
      return;
    }

    // Create updated versions of formData and responses
    const updatedFormData = { ...formData, [name]: value };
    const updatedResponses = { ...responses, [name]: value };

    // Set the updated states
    setFormData(updatedFormData);
    setResponses(updatedResponses);


    // If health concern is "Beard Growth", submit immediately
    if (
      name === "healthConcern" && value === "Beard Growth"
    ) {
      handleSubmit(updatedFormData, updatedResponses);
      return;
    }

    // Append user response to messages
    setMessages((prev) => [...prev, { type: "user", content: value }]);

    setTimeout(() => {
      const nextContent = getNextQuestion(name, value);
      if (nextContent) {
        setMessages((prev) => [...prev, { type: "bot", ...nextContent }]);
        setStep(step + 1);
      } else {
        handleSubmit(updatedFormData, updatedResponses);
      }
    }, 300);

    setCurrentInput("");
  };

  useEffect(() => {
    if (step > 0) {
      const lastAnswer = Object.entries(formData).slice(-1)[0];
      if (lastAnswer) {
        const [name, value] = lastAnswer;
        const nextContent = getNextQuestion(name, value);
        if (nextContent) {
          setMessages((prev) => [...prev, { type: "bot", ...nextContent }]);
        }
      } else {
        handleSubmit();
      }
    }
  }, [formData]);

  const handleSubmit = async (
    updatedFormData = formData,
    updatedResponses = responses
  ) => {
    try {
      const response = await axios.post(
        `https://nonucure-bot.vercel.app/api/submit-form`,
        {
          formData: updatedFormData,
          responses: updatedResponses,
        }
      );

      localStorage.setItem("userId", response.data.userId);
      setUserId(response.data.userId);

      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          content: "Thank you! Generating your recommendations...",
        },
      ]);

      setTimeout(() => navigate("/recommendation"), 1500);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          content: "Sorry, there was an error. Please try again.",
        },
      ]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 py-6 sm:px-0">
      <div className="flex justify-between items-center bg-black w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl text-white font-bold text-center text-xl sm:text-2xl font-mono p-3 rounded-t-lg">
        <a href="https://nonucare.com/?srsltid=AfmBOoqAfH4E3IkzoKgwxCjZDobgjDnnjmPSYlma7IchORUt_qsLye_n" target="_blank" >
          <img src={logo} alt="" width={70} />
        </a>
        <span className="relative -left-56">Self Assessment</span>
      </div>

      <div className="bg-white shadow-lg rounded-b-lg w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl">
        <div className="p-4 sm:p-6">
          <div className="space-y-4 max-h-[60vh] sm:max-h-[65vh] md:max-h-[70vh] overflow-y-auto mb-4 sm:mb-6 pr-1 sm:pr-2">
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.type === "bot" && (
                  <img
                    src={bot || "/placeholder.svg"}
                    alt="Chatbot"
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full mr-2 sm:mr-3 flex-shrink-0"
                  />
                )}
                <div
                  className={`max-w-[80%] rounded-lg p-3 sm:p-4 ${
                    message.type === "user"
                      ? "bg-green-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  <p className="text-sm sm:text-base">{message.content}</p>

                  {message.showStartButton && (
                    <button
                      onClick={handleStartClick}
                      className="mt-3 sm:mt-4 bg-black text-white py-1.5 sm:py-2 px-3 sm:px-4 rounded-lg hover:bg-gray-600 text-sm sm:text-base transition-colors"
                    >
                      Sure, let's start!
                    </button>
                  )}

                  {message.actions && (
                    <div className="mt-3 sm:mt-4 flex flex-wrap gap-2">
                      {message.actions.map((action, idx) => (
                        <button
                          key={idx}
                          onClick={action.onClick}
                          className="bg-black text-white py-1.5 sm:py-2 px-3 sm:px-4 rounded-lg hover:bg-gray-600 text-sm sm:text-base transition-colors"
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {message.input &&
                    message === messages[messages.length - 1] && (
                      <div className="mt-3 sm:mt-4">
                        {message.options ? (
                          <div className="space-y-2">
                            <div
                              className={`grid ${
                                message.options.some((opt) => opt.image)
                                  ? message.options.length > 4
                                    ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
                                    : "grid-cols-1 sm:grid-cols-2"
                                  : "grid-cols-1"
                              } gap-2 sm:gap-3`}
                            >
                              {message.options.map((option) => (
                                <button
                                  key={option.label}
                                  onClick={() =>
                                    handleInputSubmit(
                                      message.name,
                                      option.label
                                    )
                                  }
                                  className={`flex ${
                                    option.image ? "flex-col" : "flex-row"
                                  } items-center p-2 sm:p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors text-gray-800 border text-sm sm:text-base`}
                                >
                                  {option.image && (
                                    <div className="w-full flex justify-center">
                                      <img
                                        src={option.image || "/placeholder.svg"}
                                        alt={option.label}
                                        className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-cover mb-2"
                                      />
                                    </div>
                                  )}
                                  <span className="font-semibold text-center">
                                    {option.label}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <input
                              type={message.type || "text"}
                              className="flex-1 p-2 sm:p-3 rounded-lg border text-sm sm:text-base"
                              placeholder={message.placeholder}
                              value={currentInput}
                              onChange={(e) => setCurrentInput(e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === "Enter" && currentInput) {
                                  handleInputSubmit(message.name, currentInput);
                                }
                              }}
                            />
                            <button
                              onClick={() =>
                                handleInputSubmit(message.name, currentInput)
                              }
                              disabled={!currentInput}
                              className="bg-black text-white px-3 sm:px-4 rounded-lg hover:bg-gray-800 disabled:opacity-50 text-sm sm:text-base transition-colors"
                            >
                              Next
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                </div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Form;
