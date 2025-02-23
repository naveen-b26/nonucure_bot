import React, { useState, useRef, useEffect } from 'react';
import { motion } from "framer-motion";
import useStore from "./store";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Form() {
  const { setFormData: setGlobalFormData, setResponses: setGlobalResponses } = useStore();
  const navigate = useNavigate();
  
  const [messages, setMessages] = useState([
    {
      type: "bot",
      content: "I'm here to assist you with your health assessment."
    },
    {
      type: "bot",
      content: "May I have your details to proceed?",
      showStartButton: true
    }
  ]);

  const [currentInput, setCurrentInput] = useState("");
  const [step, setStep] = useState(0);
  const [localFormData, setLocalFormData] = useState({});
  const [localResponses, setLocalResponses] = useState({});

  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleStartClick = () => {
    setMessages(prev => [...prev,
      { type: "user", content: "Sure, let's start!" },
      { 
        type: "bot", 
        content: "What's your name?",
        input: true,
        name: "name",
        placeholder: "Enter your name"
      }
    ]);
    setStep(1);
  };

  const getNextQuestion = (name, value) => {
    if (step <= 5) {
      switch(name) {
        case "name":
          return { content: "What's your email?", input: true, name: "email", placeholder: "Enter your email" };
        case "email":
          return { content: "What's your phone number?", input: true, name: "phone", placeholder: "Enter your phone number" };
        case "phone":
          return { content: "What's your age?", input: true, name: "age", placeholder: "Enter your age", type: "number" };
        case "age":
          return { 
            content: "Please select your gender:", 
            input: true,
            name: "gender",
            options: ["Male", "Female"]
          };
        case "gender":
          return {
            content: "What's your primary health concern?",
            input: true,
            name: "healthConcern",
            options: ["Hair Loss", "Sexual Health", "Beard Growth"]
          };
        default:
          return null;
      }
    } else if (name === "healthConcern") {
      if (value === "Hair Loss") {
        if (localFormData.gender === "Male") {
          return {
            content: "Please select your hair stage:",
            input: true,
            name: "hairStage",
            options: [
              "Stage 1 (Slightly hair loss)",
              "Stage 2 (Hair line receding)",
              "Stage 3 (Developing bald spot)",
              "Stage 4 (Visible bald spot)",
              "Stage 5 (Balding from crown area)",
              "Stage 6 (Advanced balding)",
              "Heavy Hair Fall",
              "Coin Size Patch",
            ]
          };
        } else {
          return {
            content: "What does your hair look like naturally?",
            input: true,
            name: "naturalHair",
            options: ["Straight", "Curly", "Wavy", "Coily"]
          };
        }
      }
    } else if (name === "hairStage") {
      return {
        content: "Do you have dandruff?",
        input: true,
        name: "dandruff",
        options: ["Yes", "No"]
      };
    } else if (name === "dandruff" && value === "Yes") {
      return {
        content: "Select your dandruff stage:",
        input: true,
        name: "dandruffStage",
        options: ["Low", "Mild", "Moderate", "Severe"]
      };
    }else if (name === "dandruff" || name==="dandruffStage") {
      return {
        content: "Are you experiencing hair thinning or bald spots?",
        input: true,
        name: "thinningOrBaldSpots",
        options: [
          "Yes, both",
          "Yes, thinning only",
          "Yes, bald spots only",
          "No",
          "I'm not sure",
        ],
      };
    }
    
    else if (name === "thinningOrBaldSpots") {
      return {
        content: "What do you describe about energy levels:",
        input: true,
        name: "energyLevels",
        options: ["Low", "Moderate","High"]
      };
    }
    
    else if (name === "naturalHair") {
      return {
        content: "What is your current goal?",
        input: true,
        name: "goal",
        options: ["Control hair fall", "Regrow Hair"]
      };
    } else if (name === "goal") {
      return {
        content: "Do you feel more hair fall than usual?",
        input: true,
        name: "hairFall",
        options: ["Yes, extreme", "Mild", "No"]
      };
    } else if (name === "hairFall") {
      return {
        content: "Choose your main concern:",
        input: true,
        name: "mainConcern",
        options: ["Hair thinning", "Coin size patches", "Medium widening", "Advanced widening", "Less volume on sides"]
      };
    }
    return null;
  };


  const handleInputSubmit = (name, value) => {
    if (!value.trim()) return;

    setMessages(prev => [...prev, { type: "user", content: value }]);

    if (step <= 5) {
      const newFormData = { ...localFormData, [name]: value };
      setLocalFormData(newFormData);
      setGlobalFormData(newFormData);
    } else {
      const newFormData={...localFormData,[name]:value};
      const newResponses = { ...localResponses, [name]: value };
      // If dandruff is "No", set dandruffStage to null
      if (name === "dandruff" && value === "No") {
        newResponses.dandruffStage = null; // Ensure dandruffStage is null
      }

      setLocalResponses(newResponses);
      setGlobalResponses(newResponses);
    }

    const nextContent = getNextQuestion(name, value);
    
    if (nextContent) {
      setTimeout(() => {
        setMessages(prev => [...prev, { type: "bot", ...nextContent }]);
        setStep(s => s + 1);
      }, 500);
    } else {
      handleSubmit();
    }

    setCurrentInput("");
  };
  console.log(localFormData,localResponses)
  const handleSubmit = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/submit-form", {
        formData: localFormData,
        responses: localResponses,
      });

      const userId = response.data.userId;

      // Store userId in local storage
      localStorage.setItem('userId', userId);

      setGlobalFormData(prev => ({
        ...prev,
        _id: userId
      }));

      setMessages(prev => [...prev, 
        { type: "bot", content: "Thank you! Generating your recommendations..." }
      ]);

      setTimeout(() => {
        navigate("/recommendation");
      }, 1500);
    } catch (error) {
      console.error("Error:", error);
      setMessages(prev => [...prev, 
        { type: "bot", content: "Sorry, there was an error. Please try again." }
      ]);
    }
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-black w-full sm:w-[600px] text-white font-bold text-center text-2xl font-mono p-3">
        Self Assessment
      </div>

      <div className="bg-white shadow-lg rounded-lg w-full sm:w-[600px] my-4">
        <div className="p-6">
          <div className="space-y-4 max-h-[60vh] overflow-y-auto mb-6">
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[80%] rounded-lg p-4 ${
                  message.type === "user" ? "bg-green-500 text-white" : "bg-gray-200"
                }`}>
                  <p>{message.content}</p>
                  
                  {message.showStartButton && (
                    <button
                      onClick={handleStartClick}
                      className="mt-4 bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-600"
                    >
                      Sure, let's start!
                    </button>
                  )}

                  {message.input && message === messages[messages.length - 1] && (
                    <div className="mt-4">
                      {message.options ? (
                        <div className="space-y-2">
                          {message.options.map((option) => (
                            <button
                              key={option}
                              onClick={() => handleInputSubmit(message.name, option)}
                              className="w-full p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors text-gray-800 text-left"
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <input
                            type={message.type || "text"}
                            className="flex-1 p-3 rounded-lg border"
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
                            onClick={() => handleInputSubmit(message.name, currentInput)}
                            disabled={!currentInput}
                            className="bg-black text-white px-4 rounded-lg hover:bg-black disabled:opacity-50"
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












// //2
// import React, { useEffect, useRef, useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useNavigate } from 'react-router-dom';
// import useStore from './store';

// const Form = () => {
//   const [messages, setMessages] = useState([]);
//   const [currentStep, setCurrentStep] = useState(0);
//   const messagesEndRef = useRef(null);
//   const navigate = useNavigate();
  
//   const { formData, setFormData, responses, setResponses } = useStore();

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     // Initial greeting sequence
//     const timeouts = [
//       setTimeout(() => {
//         setMessages([{ type: 'bot', text: 'Hi!' }]);
//       }, 500),
//       setTimeout(() => {
//         setMessages(prev => [...prev, { 
//           type: 'bot', 
//           text: "I am Geet, your personal health coach." 
//         }]);
//       }, 1500),
//       setTimeout(() => {
//         setMessages(prev => [...prev, { 
//           type: 'bot',
//           text: "How can I help you today? What are your top concerns?",
//           options: ["Hair & Scalp", "Beard", "Skin", "Sexual health"]
//         }]);
//       }, 2500)
//     ];

//     return () => timeouts.forEach(timeout => clearTimeout(timeout));
//   }, []);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const questionsByGender = {
    // Male: [
    //   {
    //     text: "Select your primary health concern:",
    //     name: "healthConcern",
    //     options: ["Hair Loss", "Sexual Health", "Beard Growth"],
    //   },
    //   {
    //     text: "Please select your hair stage:",
    //     name: "hairStage",
    //     options: [
    //       "Stage 1 (Slightly hair loss)",
    //       "Stage 2 (Hair line receding)",
    //       "Stage 3 (Developing bald spot)",
    //       "Stage 4 (Visible bald spot)",
    //       "Stage 5 (Balding from crown area)",
    //       "Stage 6 (Advanced balding)",
    //       "Heavy Hair Fall",
    //       "Coin Size Patch",
    //     ],
    //     condition: (responses) => responses.healthConcern === "Hair Loss"
    //   },
    //   {
    //     text: "Do you have dandruff?",
    //     name: "dandruff",
    //     options: ["Yes", "No"],
    //     condition: (responses) => responses.healthConcern === "Hair Loss"
    //   },
    //   {
    //     text: "Select your dandruff stage:",
    //     name: "dandruffStage",
    //     options: ["Low", "Mild", "Moderate", "Severe"],
    //     condition: (responses) => responses.dandruff === "Yes"
    //   },
    //   {
    //     text: "How would you rate your energy levels?",
    //     name: "energyLevels",
    //     options: ["High", "Medium", "Low"],
    //     condition: (responses) => responses.healthConcern === "Hair Loss"
    //   }
    // ],
    // Female: [
    //   {
    //     text: "What does your hair look like naturally?",
    //     name: "naturalHair",
    //     options: ["Straight", "Curly", "Wavy", "Coily"]
    //   },
    //   {
    //     text: "What is your current goal?",
    //     name: "goal",
    //     options: ["Control hair fall", "Regrow Hair"]
    //   },
    //   {
    //     text: "Do you feel more hair fall than usual?",
    //     name: "hairFall",
    //     options: ["Yes, extreme", "Mild", "No"]
    //   },
    //   {
    //     text: "Choose your main concern:",
    //     name: "mainConcern",
    //     options: [
    //       "Hair thinning",
    //       "Coin size patches",
    //       "Medium widening",
    //       "Advanced widening",
    //       "Less volume on sides"
    //     ]
    //   }
    // ]
//   };

//   const handleInitialConcern = (concern) => {
//     setMessages(prev => [
//       ...prev,
//       { type: 'user', text: concern },
//       { 
//         type: 'bot', 
//         text: "I'll help you with that. First, I need some basic information. What's your name?",
//       }
//     ]);
//     setCurrentStep(1);
//   };

//   const handlePersonalInfo = (value) => {
//     const fields = ["name", "email", "phone", "age", "gender"];
//     const currentField = fields[currentStep - 1];
    
//     setFormData(prev => ({ ...prev, [currentField]: value }));

//     let nextQuestion = "";
//     switch(currentField) {
//       case "name":
//         nextQuestion = "Thanks! What's your email address?";
//         break;
//       case "email":
//         nextQuestion = "Great! And your phone number?";
//         break;
//       case "phone":
//         nextQuestion = "What's your age?";
//         break;
//       case "age":
//         nextQuestion = "Please select your gender:";
//         break;
//       case "gender":
//         const firstHealthQ = questionsByGender[value][0];
//         nextQuestion = firstHealthQ.text;
//         break;
//       default:
//         break;
//     }

//     setMessages(prev => [
//       ...prev,
//       { type: 'user', text: value },
//       { type: 'bot', text: nextQuestion }
//     ]);

//     if (currentField === "gender") {
//       setMessages(prev => [
//         ...prev,
//         {
//           type: 'bot',
//           text: questionsByGender[value][0].text,
//           options: questionsByGender[value][0].options
//         }
//       ]);
//     }

//     setCurrentStep(prev => prev + 1);
//   };

//   const handleAnswer = (answer) => {
//     const questions = questionsByGender[formData.gender];
//     const currentQuestion = questions[currentStep - 6];

//     setResponses(prev => ({
//       ...prev,
//       [currentQuestion.name]: answer
//     }));

//     // Special case for Sexual Health or Beard Growth
//     if (currentQuestion.name === "healthConcern" && 
//         (answer === "Sexual Health" || answer === "Beard Growth")) {
//       setMessages(prev => [
//         ...prev,
//         { type: 'user', text: answer },
//         { 
//           type: 'bot', 
//           text: "Thank you for sharing. Our specialists will contact you shortly to discuss your concerns privately."
//         }
//       ]);
//       setTimeout(() => navigate("/recommendation"), 2000);
//       return;
//     }

//     // Find next applicable question
//     let nextQuestion = null;
//     for (let i = currentStep - 5; i < questions.length; i++) {
//       if (!questions[i].condition || questions[i].condition(responses)) {
//         nextQuestion = questions[i];
//         break;
//       }
//     }

//     if (nextQuestion) {
//       setMessages(prev => [
//         ...prev,
//         { type: 'user', text: answer },
//         { 
//           type: 'bot',
//           text: nextQuestion.text,
//           options: nextQuestion.options
//         }
//       ]);
//       setCurrentStep(prev => prev + 1);
//     } else {
//       setMessages(prev => [
//         ...prev,
//         { type: 'user', text: answer },
//         { 
//           type: 'bot',
//           text: "Thank you for answering all questions! I'm preparing your personalized recommendations..."
//         }
//       ]);
//       setTimeout(() => navigate("/recommendation"), 2000);
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto p-4">
//       <div className="bg-white rounded-lg shadow-lg p-6 min-h-[500px] flex flex-col">
//         <div className="flex-1 overflow-y-auto mb-4">
//           <AnimatePresence>
//             {messages.map((message, index) => (
//               <motion.div
//                 key={index}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0 }}
//                 className={`flex ${message.type === 'bot' ? 'justify-start' : 'justify-end'} mb-4`}
//               >
//                 <div className={`rounded-lg p-3 max-w-[80%] ${
//                   message.type === 'bot' ? 'bg-gray-100' : 'bg-blue-500 text-white'
//                 }`}>
//                   <p>{message.text}</p>
//                   {message.options && (
//                     <div className="mt-2 space-y-2">
//                       {message.options.map((option, i) => (
//                         <button
//                           key={i}
//                           onClick={() => currentStep === 0 ? 
//                             handleInitialConcern(option) : 
//                             handleAnswer(option)}
//                           className="block w-full text-left px-3 py-2 rounded 
//                                    bg-white hover:bg-gray-50 transition-colors border"
//                         >
//                           {option}
//                         </button>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </motion.div>
//             ))}
//           </AnimatePresence>
//           <div ref={messagesEndRef} />
//         </div>

//         {currentStep > 0 && currentStep < 6 && (
//           <div className="mt-auto border-t pt-4">
//             <div className="flex gap-2">
//               <input
//                 type={currentStep === 4 ? "number" : "text"}
//                 className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder={`Enter your ${["name", "email", "phone", "age", "gender"][currentStep - 1]}`}
//                 onKeyPress={(e) => {
//                   if (e.key === "Enter" && e.target.value) {
//                     handlePersonalInfo(e.target.value);
//                     e.target.value = "";
//                   }
//                 }}
//               />
//               <button
//                 onClick={(e) => {
//                   const input = e.target.previousSibling;
//                   if (input.value) {
//                     handlePersonalInfo(input.value);
//                     input.value = "";
//                   }
//                 }}
//                 className="px-4 py-2 bg-blue-500 text-white rounded-lg 
//                          hover:bg-blue-600 transition-colors"
//               >
//                 Send
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Form;



// // //3
// import React, { useEffect, useRef, useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useNavigate } from 'react-router-dom';
// import useStore from './store';

// const Form = () => {
//   const [messages, setMessages] = useState([]);
//   const [currentStep, setCurrentStep] = useState(0);
//   const messagesEndRef = useRef(null);
//   const navigate = useNavigate();
  
//   const { formData, setFormData, responses, setResponses } = useStore();

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     // Initial greeting sequence
//     const timeouts = [
//       setTimeout(() => {
//         setMessages([{ type: 'bot', text: 'Hi!' }]);
//       }, 500),
//       setTimeout(() => {
//         setMessages(prev => [...prev, { 
//           type: 'bot', 
//           text: "I am Geet, your personal health coach." 
//         }]);
//       }, 1500),
//       setTimeout(() => {
//         setMessages(prev => [...prev, { 
//           type: 'bot',
//           text: "I'm here to help you with your health assessment.",
//           showStartButton: true
//         }]);
//       }, 2500)
//     ];

//     return () => timeouts.forEach(timeout => clearTimeout(timeout));
//   }, []);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const handleStart = () => {
//     setMessages(prev => [
//       ...prev,
//       { 
//         type: 'bot',
//         text: "Great! Let's begin with some basic information. What's your name?"
//       }
//     ]);
//     setCurrentStep(1);
//   };

//   const questionsByGender = {
//     Male: [
//       {
//         text: "Select your primary health concern:",
//         name: "healthConcern",
//         options: ["Hair Loss", "Sexual Health", "Beard Growth"],
//       },
//       {
//         text: "Please select your hair stage:",
//         name: "hairStage",
//         options: [
//           "Stage 1 (Slightly hair loss)",
//           "Stage 2 (Hair line receding)",
//           "Stage 3 (Developing bald spot)",
//           "Stage 4 (Visible bald spot)",
//           "Stage 5 (Balding from crown area)",
//           "Stage 6 (Advanced balding)",
//           "Heavy Hair Fall",
//           "Coin Size Patch",
//         ],
//         condition: (responses) => responses.healthConcern === "Hair Loss"
//       },
//       {
//         text: "Do you have dandruff?",
//         name: "dandruff",
//         options: ["Yes", "No"],
//         condition: (responses) => responses.healthConcern === "Hair Loss"
//       },
//       {
//         text: "Select your dandruff stage:",
//         name: "dandruffStage",
//         options: ["Low", "Mild", "Moderate", "Severe"],
//         condition: (responses) => responses.dandruff === "Yes"
//       },
//       {
//         text: "How would you rate your energy levels?",
//         name: "energyLevels",
//         options: ["High", "Medium", "Low"],
//         condition: (responses) => responses.healthConcern === "Hair Loss"
//       }
//     ],
//     Female: [
//       {
//         text: "What does your hair look like naturally?",
//         name: "naturalHair",
//         options: ["Straight", "Curly", "Wavy", "Coily"]
//       },
//       {
//         text: "What is your current goal?",
//         name: "goal",
//         options: ["Control hair fall", "Regrow Hair"]
//       },
//       {
//         text: "Do you feel more hair fall than usual?",
//         name: "hairFall",
//         options: ["Yes, extreme", "Mild", "No"]
//       },
//       {
//         text: "Choose your main concern:",
//         name: "mainConcern",
//         options: [
//           "Hair thinning",
//           "Coin size patches",
//           "Medium widening",
//           "Advanced widening",
//           "Less volume on sides"
//         ]
//       },
//       {
//         text: "Do you experience scalp itching?",
//         name: "scalpItching",
//         options: ["Yes", "No"]
//       },
//       {
//         text: "How often do you oil your hair?",
//         name: "oilFrequency",
//         options: ["Daily", "Twice a week", "Once a week", "Rarely"]
//       }
//     ]
//   };
  
//   const handleAnswer = (answer) => {
//     const gender = formData.gender;  
//     if (!gender) {
//       console.error("Gender is not set before answering.");
//       return;
//     }
  
//     const questions = questionsByGender[gender] || [];  
//     if (!questions.length) {
//       console.error(`No questions found for gender: ${gender}`);
//       return;
//     }
  
//     const currentQuestion = questions[currentStep - 6];
  
//     if (!currentQuestion) {
//       console.error(`No question found at index ${currentStep - 6}`);
//       return;
//     }
  
//     setResponses(prev => ({
//       ...prev,
//       [currentQuestion.name]: answer
//     }));

//     // ✅ Also update formData
//     setFormData(prev => ({
//       ...prev,
//       [currentQuestion.name]: answer
//     }));
  
//     // Special case for Sexual Health or Beard Growth
//     if (currentQuestion.name === "healthConcern" && 
//         (answer === "Sexual Health" || answer === "Beard Growth")) {
//       setMessages(prev => [
//         ...prev,
//         { type: 'user', text: answer },
//         { 
//           type: 'bot', 
//           text: "Thank you for sharing. Our specialists will contact you shortly to discuss your concerns privately."
//         }
//       ]);
//       setTimeout(() => navigate("/recommendation"), 2000);
//       return;
//     }
  
//     // Find next applicable question
//     let nextQuestion = null;
//     for (let i = currentStep - 5; i < questions.length; i++) {
//       if (!questions[i].condition || questions[i].condition(responses)) {
//         nextQuestion = questions[i];
//         break;
//       }
//     }
  
//     if (nextQuestion) {
//       setMessages(prev => [
//         ...prev,
//         { type: 'user', text: answer },
//         { 
//           type: 'bot',
//           text: nextQuestion.text,
//           options: nextQuestion.options
//         }
//       ]);
//       setCurrentStep(prev => prev + 1);
//     } else {
//       setMessages(prev => [
//         ...prev,
//         { type: 'user', text: answer },
//         { 
//           type: 'bot',
//           text: "Thank you for answering all questions! I'm preparing your personalized recommendations..."
//         }
//       ]);
//       setTimeout(() => navigate("/recommendation"), 2000);
//     }
// };

  
  
// const handlePersonalInfo = (value) => {
//   const fields = ["name", "email", "phone", "age", "gender"];
//   const currentField = fields[currentStep - 1];

//   setFormData(prev => ({ ...prev, [currentField]: value }));  // ✅ Store into formData

//   let nextQuestion = "";
//   switch(currentField) {
//     case "name":
//       nextQuestion = "Thanks! What's your email address?";
//       break;
//     case "email":
//       nextQuestion = "Great! And your phone number?";
//       break;
//     case "phone":
//       nextQuestion = "What's your age?";
//       break;
//     case "age":
//       nextQuestion = "Please select your gender:";
//       break;
//     case "gender":
//       const firstHealthQ = questionsByGender[value][0];
//       nextQuestion = firstHealthQ.text;
//       break;
//     default:
//       break;
//   }

//   setMessages(prev => [
//     ...prev,
//     { type: 'user', text: value },
//     { type: 'bot', text: nextQuestion }
//   ]);

//   if (currentField === "gender") {
//     setMessages(prev => [
//       ...prev,
//       {
//         type: 'bot',
//         text: questionsByGender[value][0].text,
//         options: questionsByGender[value][0].options
//       }
//     ]);
//   }

//   setCurrentStep(prev => prev + 1);
// };

//   // ... rest of the handlers remain the same
//   console.log("Gender:", formData.gender);
// console.log("Questions:", questionsByGender[formData.gender]);

// console.log("formDate:", formData);
//   return (
//     <div className="max-w-2xl mx-auto p-4">
//       <div className="bg-white rounded-lg shadow-lg p-6 min-h-[500px] flex flex-col">
//         <div className="flex-1 overflow-y-auto mb-4">
//           <AnimatePresence>
//             {messages.map((message, index) => (
//               <motion.div
//                 key={index}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0 }}
//                 className={`flex ${message.type === 'bot' ? 'justify-start' : 'justify-end'} mb-4`}
//               >
//                 <div className={`rounded-lg p-3 max-w-[80%] ${
//                   message.type === 'bot' ? 'bg-gray-100' : 'bg-blue-500 text-white'
//                 }`}>
//                   <p>{message.text}</p>
//                   {message.showStartButton && (
//                     <motion.button
//                       onClick={handleStart}
//                       className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg 
//                                hover:bg-blue-600 transition-colors"
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                     >
//                       Let's Start!
//                     </motion.button>
//                   )}
//                   {message.options && (
//                     <div className="mt-2 space-y-2">
//                       {message.options.map((option, i) => (
//                         <button
//                           key={i}
//                           onClick={() => handleAnswer(option)}
//                           className="block w-full text-left px-3 py-2 rounded 
//                                    bg-white hover:bg-gray-50 transition-colors border"
//                         >
//                           {option}
//                         </button>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </motion.div>
//             ))}
//           </AnimatePresence>
//           <div ref={messagesEndRef} />
//         </div>

//         {currentStep > 0 && currentStep < 6 && (
//           <div className="mt-auto border-t pt-4">
//             <div className="flex gap-2">
//               <input
//                 type={currentStep === 4 ? "number" : "text"}
//                 className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder={`Enter your ${["name", "email", "phone", "age", "gender"][currentStep - 1]}`}
//                 onKeyPress={(e) => {
//                   if (e.key === "Enter" && e.target.value) {
//                     handlePersonalInfo(e.target.value);
//                     e.target.value = "";
//                   }
//                 }}
//               />
//               <button
//                 onClick={(e) => {
//                   const input = e.target.previousSibling;
//                   if (input.value) {
//                     handlePersonalInfo(input.value);
//                     input.value = "";
//                   }
//                 }}
//                 className="px-4 py-2 bg-blue-500 text-white rounded-lg 
//                          hover:bg-blue-600 transition-colors"
//               >
//                 Send
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Form;



