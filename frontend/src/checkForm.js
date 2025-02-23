"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import useStore from "./store"
import axios from "axios"
import { useNavigate } from "react-router-dom"

function Form() {
  const { formData, setFormData, setResponses } = useStore()
  const [step, setStep] = useState(0)
  const [responses, setResponsesState] = useState({})
  const [messages, setMessages] = useState([])
  const navigate = useNavigate()

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
      // ... rest of male questions remain the same
    ],
    Female: [
      // ... female questions remain the same
    ],
  }

  const personalInfoQuestions = [
    { text: "What's your name?", name: "name", type: "text" },
    { text: "What's your email?", name: "email", type: "email" },
    { text: "What's your phone number?", name: "phone", type: "text" },
    { text: "How old are you?", name: "age", type: "number" },
    {
      text: "What's your gender?",
      name: "gender",
      type: "select",
      options: ["Male", "Female"],
    },
  ]

  useEffect(() => {
    // Initial greeting
    addMessage({
      type: "bot",
      text: "Hi! I'm Geet, your personal health coach.",
    })
    setTimeout(() => {
      addMessage({
        type: "bot",
        text: "Let me help you with your health assessment. What's your name?",
        input: "name",
      })
    }, 500)
  }, [])

  const addMessage = (message) => {
    setMessages((prev) => [...prev, message])
  }

  const handleInputChange = (name, value) => {
    if (personalInfoQuestions.find((q) => q.name === name)) {
      setFormData((prev) => ({ ...prev, [name]: value }))
    } else {
      setResponsesState((prev) => ({ ...prev, [name]: value }))
      setResponses({ [name]: value })
    }

    // Add user's response as a message
    addMessage({
      type: "user",
      text: value,
    })

    // Get next question
    const nextQuestion = getNextQuestion(name)
    if (nextQuestion) {
      setTimeout(() => {
        addMessage({
          type: "bot",
          text: nextQuestion.text,
          input: nextQuestion.name,
          options: nextQuestion.options,
          type: nextQuestion.type,
        })
      }, 500)
    } else if (name === "gender") {
      // Start health-specific questions
      const healthQuestions = questionsByGender[value]
      if (healthQuestions && healthQuestions.length > 0) {
        setTimeout(() => {
          addMessage({
            type: "bot",
            text: healthQuestions[0].text,
            input: healthQuestions[0].name,
            options: healthQuestions[0].options,
          })
        }, 500)
      }
    }
  }

  const getNextQuestion = (currentName) => {
    const personalIndex = personalInfoQuestions.findIndex((q) => q.name === currentName)
    if (personalIndex < personalInfoQuestions.length - 1) {
      return personalInfoQuestions[personalIndex + 1]
    }
    return null
  }

  const handleSubmit = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/submit-form", {
        formData,
        responses,
      })

      setFormData({
        ...formData,
        _id: response.data.userId,
      })

      addMessage({
        type: "bot",
        text: "Thank you! I've recorded your responses. Our team will contact you shortly.",
      })

      setTimeout(() => {
        navigate("/recommendation")
      }, 2000)
    } catch (error) {
      console.error("Error submitting form:", error)
      addMessage({
        type: "bot",
        text: "Sorry, there was an error submitting your responses. Please try again.",
      })
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="bg-black text-white p-4">
        <h1 className="text-xl font-semibold">Self Assessment</h1>
      </div>

      <div className="h-2 bg-gray-200">
        <div
          className="h-full bg-blue-500 transition-all duration-500"
          style={{ width: `${(messages.length / (personalInfoQuestions.length + 2)) * 100}%` }}
        />
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] ${message.type === "user" ? "bg-blue-500 text-white" : "bg-white"} rounded-lg p-4 shadow-sm`}
              >
                <p>{message.text}</p>
                {message.input && (
                  <div className="mt-4">
                    {message.type === "select" || message.options ? (
                      <div className="space-y-2">
                        {message.options.map((option) => (
                          <button
                            key={option}
                            onClick={() => handleInputChange(message.input, option)}
                            className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-800"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <input
                        type={message.type || "text"}
                        className="w-full border rounded-lg px-4 py-2 text-gray-800"
                        placeholder={`Enter your ${message.input}`}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            handleInputChange(message.input, e.target.value)
                            e.target.value = ""
                          }
                        }}
                      />
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Form

