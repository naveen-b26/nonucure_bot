"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import useStore from "./store"
import axios from "axios"
import sH from "./pics/sexualHealth.png"
import bW from "./pics/beardGrowth.png"
import hL from "./pics/hairloss.png"
import s1 from "./pics/stage-1.png"
import s2 from "./pics/stage-2.png"
import s3 from "./pics/stage-3.png"
import s4 from "./pics/stage-4.png"
import s5 from "./pics/stage-5.png"
import s6 from "./pics/stage-6.png"
import s7 from "./pics/stage-7.png"
import dn from "./pics/dandruffNo.png"
import dy from "./pics/dandruffYes.jpg"
import sth from "./pics/stH.png"
import wy from "./pics/wavyHair.jpg"
import cy from "./pics/curlyHair.jpg"
import co from "./pics/coilyHair.png"
import Gummies from "./pics/gummies.jpg"
import Sinibis from "./pics/sinibis.jpg"
import shilajit from "./pics/shilajit.jpg"
import hgw from "./pics/hairGrowthSerum.jpg"
import minibis from "./pics/minibis.jpg"

const RecommendationPage = () => {
  const imageMap = {
    healthConcern: {
      "Sexual Health": sH,
      "Beard Growth": bW,
      "Hair Loss": hL,
    },
    hairStage: {
      "Stage 1 (Slightly hair loss)": s1,
      "Stage 2 (Hair line receding)": s2,
      "Stage 3 (Developing bald spot)": s3,
      "Stage 4 (Visible bald spot)": s4,
      "Stage 5 (Balding from crown area)": s5,
      "Stage 6 (Advanced balding)": s6,
      "Heavy Hair Fall": s7,
    },
    dandruff: {
      Yes: dy,
      No: dn,
    },
    naturalHair: {
      Straight: sth,
      Wavy: wy,
      Curly: cy,
      Coily: co,
    },
  }

  const productImages = {
    Gummies: Gummies,
    "Biotin Gummies": Gummies,
    Sinibis: Sinibis,
    "Minoxidil 5%": minibis,
    "Hair Growth Serum": hgw,
    Shilajit: shilajit,
  }

  const { formData, responses, userId } = useStore()
  const [recommendation, setRecommendation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    // Check if we have the required data
    if (!formData || !responses) {
      console.log("Missing form data, redirecting to form")
      navigate("/")
      return
    }

    const fetchData = async () => {
      try {
        await fetchRecommendation()
      } catch (error) {
        console.error("Error fetching recommendation:", error)
      }
    }

    fetchData()
  }, [formData, responses])

  const fetchRecommendation = async () => {
    setLoading(true)
    setError("")

    try {
      const userId = localStorage.getItem("userId")
      console.log("UserId from storage:", userId)

      if (!userId) {
        setError("User ID not found. Please complete the assessment first.")
        setLoading(false)
        return
      }

      const response = await axios.post(`https://nonucure-bot.vercel.app/api/recommend`, {
        userId: userId,
        gender: formData.gender,
        healthConcern: responses.healthConcern,
        hairStage: responses.hairStage,
        dandruff: responses.dandruff,
        dandruffStage: responses.dandruffStage,
        energyLevels: responses.energyLevels,
        naturalHair: responses.naturalHair,
        goal: responses.goal,
        hairFall: responses.hairFall,
        mainConcern: responses.mainConcern,
      })
      localStorage.removeItem("userId")
      setRecommendation(response.data)
    } catch (error) {
      console.error("Recommendation error:", error)
      setError("Error generating recommendations. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-center p-6 bg-white rounded-lg shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-xl font-medium text-gray-700">Loading your personalized recommendations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center p-4 sm:p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold text-center text-green-600 mb-4 sm:mb-6">Your Hair Care Journey</h1>

      {error && (
        <div className="text-red-500 text-lg mb-4 p-4 bg-white rounded-lg shadow w-full max-w-4xl">{error}</div>
      )}

      <div className="w-full max-w-4xl flex flex-col gap-6">
        {/* Personal Information Section */}
        <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 text-center">
          <h2 className="text-xl sm:text-2xl">Hey {formData.name}!!</h2>
          <p className="text-green-600">Let's review your concerns!</p>
        </div>

        {/* Assessment Answers Section */}
        <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-green-700 mb-4 text-center">Your Issues</h2>

          {formData.gender === "Male" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex flex-col items-center">
                <p className="font-medium mb-2">Health Concern:</p>
                <div className="flex flex-col items-center">
                  {imageMap.healthConcern[responses.healthConcern] && (
                    <div className="w-32 h-32 flex items-center justify-center mb-2">
                      <img
                        src={imageMap.healthConcern[responses.healthConcern] || "/placeholder.svg"}
                        alt="Health Concern"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  )}
                  <p className="text-gray-600 text-center">{responses.healthConcern}</p>
                </div>
              </div>

              {responses.healthConcern === "Hair Loss" && (
                <>
                  <div className="flex flex-col items-center">
                    <p className="font-medium mb-2">Hair Stage:</p>
                    <div className="flex flex-col items-center">
                      {imageMap.hairStage[responses.hairStage] && (
                        <div className="w-32 h-32 flex items-center justify-center mb-2">
                          <img
                            src={imageMap.hairStage[responses.hairStage] || "/placeholder.svg"}
                            alt="Hair Stage"
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                      )}
                      <p className="text-gray-600 text-center">{responses.hairStage}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    <p className="font-medium mb-2">Dandruff:</p>
                    <div className="flex flex-col items-center">
                      {imageMap.dandruff[responses.dandruff] && (
                        <div className="w-32 h-32 flex items-center justify-center mb-2">
                          <img
                            src={imageMap.dandruff[responses.dandruff] || "/placeholder.svg"}
                            alt="Dandruff"
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                      )}
                      <p className="text-gray-600 text-center">{responses.dandruff}</p>
                    </div>
                  </div>

                  {responses.dandruff === "Yes" && (
                    <div className="flex flex-col items-center">
                      <p className="font-medium mb-2">Dandruff Stage:</p>
                      <div className="w-32 h-32 flex items-center justify-center mb-2">
                        <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center">
                          <span className="text-lg font-medium text-gray-700">{responses.dandruffStage}</span>
                        </div>
                      </div>
                      <p className="text-gray-600 text-center">{responses.dandruffStage}</p>
                    </div>
                  )}

                  <div className="flex flex-col items-center">
                    <p className="font-medium mb-2">Energy Levels:</p>
                    <div className="w-32 h-32 flex items-center justify-center mb-2">
                      <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center">
                        <span className="text-lg font-medium text-gray-700">{responses.energyLevels}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-center">{responses.energyLevels}</p>
                  </div>
                </>
              )}
            </div>
          )}

          {formData.gender === "Female" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex flex-col items-center">
                <p className="font-medium mb-2">Natural Hair Type:</p>
                <div className="flex flex-col items-center">
                  {imageMap.naturalHair[responses.naturalHair] && (
                    <div className="w-32 h-32 flex items-center justify-center mb-2">
                      <img
                        src={imageMap.naturalHair[responses.naturalHair] || "/placeholder.svg"}
                        alt="Hair Type"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  )}
                  <p className="text-gray-600 text-center">{responses.naturalHair}</p>
                </div>
              </div>

              <div className="flex flex-col items-center">
                <p className="font-medium mb-2">Hair Goal:</p>
                <div className="w-32 h-32 flex items-center justify-center mb-2">
                  <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center">
                    <span className="text-lg font-medium text-gray-700">{responses.goal}</span>
                  </div>
                </div>
                <p className="text-gray-600 text-center">{responses.goal}</p>
              </div>

              <div className="flex flex-col items-center">
                <p className="font-medium mb-2">Hair Fall:</p>
                <div className="w-32 h-32 flex items-center justify-center mb-2">
                  <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center">
                    <span className="text-lg font-medium text-gray-700">{responses.hairFall}</span>
                  </div>
                </div>
                <p className="text-gray-600 text-center">{responses.hairFall}</p>
              </div>

              <div className="flex flex-col items-center">
                <p className="font-medium mb-2">Main Concern:</p>
                <div className="w-32 h-32 flex items-center justify-center mb-2">
                  <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center text-center px-2">
                    <span className="text-sm font-medium text-gray-700">{responses.healthConcern}</span>
                  </div>
                </div>
                <p className="text-gray-600 text-center">{responses.healthConcern}</p>
              </div>
            </div>
          )}
        </div>

        {/* Recommendation Section */}
        {recommendation && (
          <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-green-700 mb-4 text-center">
              Your Personalized Recommendation
            </h2>
            <hr className="mb-4" />

            <div className="space-y-6">
              <div className="text-center">
                <p className="text-lg font-medium text-green-600 mb-2">Recommended Kit:</p>
                <p className="text-gray-800 text-xl">{recommendation.kit}</p>
              </div>

              <div>
                <p className="text-lg font-medium text-green-600 mb-4 text-center">Recommended Products:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {recommendation.products?.map((product, index) => (
                    <div key={index} className="flex flex-col items-center bg-gray-50 rounded-lg p-3">
                      {productImages[product] && (
                        <div className="w-32 h-32 flex items-center justify-center mb-2">
                          <img
                            src={productImages[product] || "/placeholder.svg"}
                            alt={product}
                            className="max-w-full max-h-full object-contain rounded-md"
                          />
                        </div>
                      )}
                      <p className="text-gray-800 font-medium text-center">{product}</p>
                    </div>
                  ))}
                </div>
              </div>

              {recommendation.advice && (
                <div>
                  <p className="text-lg font-medium text-green-600 mb-3 text-center">Expert Advice:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    {recommendation.advice.map((tip, index) => (
                      <li key={index} className="text-gray-800">
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        <button
          onClick={() => navigate("/")}
          className="w-full py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
        >
          Back to Assessment
        </button>
      </div>
    </div>
  )
}

export default RecommendationPage

