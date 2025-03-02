// import React, { useState, useRef, useEffect } from 'react';
// import { motion } from "framer-motion";
// import useStore from "./store";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// function Form() {
//   const {userId,setUserId,formData,setFormData,responses,setResponses} = useStore();
//   const navigate = useNavigate();
  
//   const [messages, setMessages] = useState([
//     {
//       type: "bot",
//       content: "I'm here to assist you with your health assessment."
//     },
//     {
//       type: "bot",
//       content: "May I have your details to proceed?",
//       showStartButton: true
//     }
//   ]);

//   const [currentInput, setCurrentInput] = useState("");
//   const [step, setStep] = useState(0);
//   const messagesEndRef = useRef(null);
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };
//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);
//   const handleStartClick = () => {
//     setMessages(prev => [...prev,
//       { type: "user", content: "Sure, let's start!" },
//       { 
//         type: "bot", 
//         content: "What's your name?",
//         input: true,
//         name: "name",
//         placeholder: "Enter your name"
//       }
//     ]);
//     setStep(1);
//   };
//   const getNextQuestion = (name, value) => {
//     if (step <= 5) {
//       switch(name) {
//         case "name":
//           return { content: "What's your email?", input: true, name: "email", placeholder: "Enter your email" };
//         case "email":
//           return { content: "What's your phone number?", input: true, name: "phone", placeholder: "Enter your phone number" };
//         case "phone":
//           return { content: "What's your age?", input: true, name: "age", placeholder: "Enter your age", type: "number" };
//         case "age":
//           return { 
//             content: "Please select your gender:", 
//             input: true,
//             name: "gender",
//             options: ["Male", "Female"]
//           };
//         case "gender":
//           if (value === "Male") {
//             return {
//               content: "What's your primary health concern?",
//               input: true,
//               name: "healthConcern",
//               options: ["Hair Loss", "Sexual Health", "Beard Growth"]
//             };
//           } else {
//             return {
//               content: "What's your primary health concern?",
//               input: true,
//               name: "healthConcern",
//               options: ["Hair Loss"]
//             };
//           }
//         default:
//           return null;
//       }
//     } else if (name === "healthConcern") {
//       if (value === "Hair Loss") {
//         if (formData.gender === "Male") {
//           return {
//             content: "Please select your hair stage:",
//             input: true,
//             name: "hairStage",
//             options: [
//               "Stage 1 (Slightly hair loss)",
//               "Stage 2 (Hair line receding)",
//               "Stage 3 (Developing bald spot)",
//               "Stage 4 (Visible bald spot)",
//               "Stage 5 (Balding from crown area)",
//               "Stage 6 (Advanced balding)",
//               "Heavy Hair Fall",
//               "Coin Size Patch",
//             ]
//           };
//         } else {
//           return {
//             content: "What does your hair look like naturally?",
//             input: true,
//             name: "naturalHair",
//             options: ["Straight", "Curly", "Wavy", "Coily"]
//           };
//         }
//       }
//     } else if (name === "hairStage") {
//       return {
//         content: "Do you have dandruff?",
//         input: true,
//         name: "dandruff",
//         options: ["Yes", "No"]
//       };
//     } else if (name === "dandruff" && value === "Yes") {
//       return {
//         content: "Select your dandruff stage:",
//         input: true,
//         name: "dandruffStage",
//         options: ["Low", "Mild", "Moderate", "Severe"]
//       };
//     }else if (name === "dandruff" || name==="dandruffStage") {
//       return {
//         content: "Are you experiencing hair thinning or bald spots?",
//         input: true,
//         name: "thinningOrBaldSpots",
//         options: [
//           "Yes, both",
//           "Yes, thinning only",
//           "Yes, bald spots only",
//           "No",
//           "I'm not sure",
//         ],
//       };
//     }
    
//     else if (name === "thinningOrBaldSpots") {
//       return {
//         content: "What do you describe about energy levels:",
//         input: true,
//         name: "energyLevels",
//         options: ["Low", "Moderate","High"]
//       };
//     }
    
//     else if (name === "naturalHair") {
//       return {
//         content: "What is your current goal?",
//         input: true,
//         name: "goal",
//         options: ["Control hair fall", "Regrow Hair"]
//       };
//     } else if (name === "goal") {
//       return {
//         content: "Do you feel more hair fall than usual?",
//         input: true,
//         name: "hairFall",
//         options: ["Yes, extreme", "Mild", "No"]
//       };
//     } else if (name === "hairFall") {
//       return {
//         content: "Choose your main concern:",
//         input: true,
//         name: "mainConcern",
//         options: ["Hair thinning", "Coin size patches", "Medium widening", "Advanced widening", "Less volume on sides"]
//       };
//     }
//     return null;
//   };
//   const handleInputSubmit = async (name, value) => {
    
//     // Immediately update both formData and responses regardless of step
//     const updatedFormData = { ...formData, [name]: value };
//     const updatedResponses = { ...responses, [name]: value };

//     // Special case for Sexual Health or Beard Growth
//     if (name === "healthConcern" && (value === "Sexual Health" || value === "Beard Growth")) {
//       setFormData(updatedFormData);
//       setResponses(updatedResponses);
//       handleSubmit();
//       return;
//     }

//     // Special handling for dandruff "No" response
//     if (name === "dandruff" && value === "No") {
//       updatedFormData.dandruffStage = "None";
//       updatedResponses.dandruffStage = "None";
//     }

//     // Update state with the new values
//     setFormData(updatedFormData);
//     setResponses(updatedResponses);

//     // Update messages with user's response
//     setMessages(prev => [...prev, { type: "user", content: value }]);

//     // Get next question after state updates
//     const nextContent = getNextQuestion(name, value);
//     if (nextContent) {
//       setTimeout(() => {
//         setMessages(prev => [...prev, { type: "bot", ...nextContent }]);
//         setStep(s => s + 1);
//       }, 500);
//     } else {
//       handleSubmit();
//     }

//     setCurrentInput("");
    
//   };
//   const handleSubmit = async () => {
//     console.log("formDate",formData)
//     console.log("responces",responses)
//     try {
//       const response = await axios.post("http://localhost:5000/api/submit-form", {
//         formData: formData,
//         responses: responses,
//       });

//       localStorage.setItem('userId', response.data.userId);
//       // Store userId in local storage
//      setUserId(response.data.userId);

//       setFormData(prev => ({
//         ...prev,
//         _id: userId
//       }));

//       setMessages(prev => [...prev, 
//         { type: "bot", content: "Thank you! Generating your recommendations..." }
//       ]);

//       setTimeout(() => {
//         navigate("/recommendation");
//       }, 1500);
//     } catch (error) {
//       console.error("Error:", error);
//       setMessages(prev => [...prev, 
//         { type: "bot", content: "Sorry, there was an error. Please try again." }
//       ]);
//     }
//   };
//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
//       <div className="bg-black w-full sm:w-[600px] text-white font-bold text-center text-2xl font-mono p-3">
//         Self Assessment
//       </div>

//       <div className="bg-white shadow-lg rounded-lg w-full sm:w-[600px] my-4">
//         <div className="p-6">
//           <div className="space-y-4 max-h-[60vh] overflow-y-auto mb-6">
//             {messages.map((message, index) => (
//               <motion.div
//                 key={index}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
//               >
//                 <div className={`max-w-[80%] rounded-lg p-4 ${
//                   message.type === "user" ? "bg-green-500 text-white" : "bg-gray-200"
//                 }`}>
//                   <p>{message.content}</p>
                  
//                   {message.showStartButton && (
//                     <button
//                       onClick={handleStartClick}
//                       className="mt-4 bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-600"
//                     >
//                       Sure, let's start!
//                     </button>
//                   )}

//                   {message.input && message === messages[messages.length - 1] && (
//                     <div className="mt-4">
//                       {message.options ? (
//                         <div className="space-y-2">
//                           {message.options.map((option) => (
//                             <button
//                               key={option}
//                               onClick={() => handleInputSubmit(message.name, option)}
//                               className="w-full p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors text-gray-800 text-left"
//                             >
//                               {option}
//                             </button>
//                           ))}
//                         </div>
//                       ) : (
//                         <div className="flex gap-2">
//                           <input
//                             type={message.type || "text"}
//                             className="flex-1 p-3 rounded-lg border"
//                             placeholder={message.placeholder}
//                             value={currentInput}
//                             onChange={(e) => setCurrentInput(e.target.value)}
//                             onKeyPress={(e) => {
//                               if (e.key === "Enter" && currentInput) {
//                                 handleInputSubmit(message.name, currentInput);
//                               }
//                             }}
//                           />
//                           <button
//                             onClick={() => handleInputSubmit(message.name, currentInput)}
//                             disabled={!currentInput}
//                             className="bg-black text-white px-4 rounded-lg hover:bg-black disabled:opacity-50"
//                           >
//                             Next
//                           </button>
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               </motion.div>
//             ))}
//             <div ref={messagesEndRef} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// export default Form;


//2nd
import React, { useState, useRef, useEffect } from 'react';
import { motion } from "framer-motion";
import useStore from "./store";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Form() {
  const { userId, setUserId, formData, setFormData, responses, setResponses } = useStore();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([
    { type: "bot", content: "I'm here to assist you with your health assessment." },
    { type: "bot", content: "May I have your details to proceed?", showStartButton: true }
  ]);

  const [currentInput, setCurrentInput] = useState("");
  const [step, setStep] = useState(0);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    console.log("Updated formData:", formData);
    console.log("Updated responses:", responses);
  }, [formData, responses]);

  const handleStartClick = () => {
    setMessages(prev => [
      ...prev,
      { type: "user", content: "Sure, let's start!" },
      { type: "bot", content: "What's your name?", input: true, name: "name", placeholder: "Enter your name" }
    ]);
    setStep(1);
  };

  const getNextQuestion = (name, value) => {
    switch (name) {
      case "name":
        return { content: "What's your email?", input: true, name: "email", placeholder: "Enter your email" };
      case "email":
        return { content: "What's your phone number?", input: true, name: "phone", placeholder: "Enter your phone number" };
      case "phone":
        return { content: "What's your age?", input: true, name: "age", placeholder: "Enter your age", type: "number" };
      case "age":
        return { content: "Please select your gender:", input: true, name: "gender", options: ["Male", "Female"] };
      case "gender":
        return { content: "What's your primary health concern?", input: true, name: "healthConcern", options: value === "Male" ? ["Hair Loss", "Sexual Health", "Beard Growth"] : ["Hair Loss"] };
      case "healthConcern":
        if (value === "Hair Loss") {
          return { content: "Please select your hair stage:", input: true, name: "hairStage", options: ["Stage 1", "Stage 2", "Stage 3", "Stage 4", "Stage 5", "Stage 6"] };
        }
        return null;
      case "hairStage":
        return { content: "Do you have dandruff?", input: true, name: "dandruff", options: ["Yes", "No"] };
      case "dandruff":
        return value === "Yes"
          ? { content: "Select your dandruff stage:", input: true, name: "dandruffStage", options: ["Low", "Mild", "Moderate", "Severe"] }
          : { content: "Are you experiencing hair thinning or bald spots?", input: true, name: "thinningOrBaldSpots", options: ["Yes, both", "Yes, thinning only", "Yes, bald spots only", "No", "I'm not sure"] };
      case "thinningOrBaldSpots":
        return { content: "How do you describe your energy levels?", input: true, name: "energyLevels", options: ["Low", "Moderate", "High"] };
      default:
        return null;
    }
  };

  const handleInputSubmit = async (name, value) => {
    // Create updated versions of formData and responses
    const updatedFormData = { ...formData, [name]: value };
    const updatedResponses = { ...responses, [name]: value };
  
    // Set the updated states
    setFormData(updatedFormData);
    setResponses(updatedResponses);
  
    // If health concern is "Sexual Health" or "Beard Growth", submit immediately
    if (name === "healthConcern" && (value === "Sexual Health" || value === "Beard Growth")) {
      handleSubmit(updatedFormData, updatedResponses);
      return;
    }
  
    // Append user response to messages
    setMessages(prev => [...prev, { type: "user", content: value }]);
  
    setTimeout(() => {
      const nextContent = getNextQuestion(name, value);
      if (nextContent) {
        setMessages(prev => [...prev, { type: "bot", ...nextContent }]);
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
          setMessages(prev => [...prev, { type: "bot", ...nextContent }]);
        }
      } else {
        handleSubmit();
      }
    }
  }, [formData]);

  
  const handleSubmit = async (updatedFormData = formData, updatedResponses = responses) => {
  console.log("Submitting Data", updatedFormData, updatedResponses);
  try {
    const response = await axios.post("http://localhost:5000/api/submit-form", {
      formData: updatedFormData,
      responses: updatedResponses
    });

    localStorage.setItem('userId', response.data.userId);
    setUserId(response.data.userId);

    setMessages(prev => [...prev, { type: "bot", content: "Thank you! Generating your recommendations..." }]);

    setTimeout(() => navigate("/recommendation"), 1500);
  } catch (error) {
    console.error("Error:", error);
    setMessages(prev => [...prev, { type: "bot", content: "Sorry, there was an error. Please try again." }]);
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
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-lg p-4 ${message.type === "user" ? "bg-green-500 text-white" : "bg-gray-200"}`}>
                  <p>{message.content}</p>
                  {message.showStartButton && <button onClick={handleStartClick} className="mt-4 bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-600">Sure, let's start!</button>}
                  {message.input && (
                    <div className="mt-2">
                      {message.options ? message.options.map((option, i) => (
                        <button key={i} onClick={() => handleInputSubmit(message.name, option)} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700">{option}</button>
                      )) : <input type={message.type || "text"} placeholder={message.placeholder} value={currentInput} onChange={(e) => setCurrentInput(e.target.value)} onKeyPress={(e) => e.key === "Enter" && handleInputSubmit(message.name, currentInput)} className="border rounded-lg p-2 w-full mt-2" />}
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
