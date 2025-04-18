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
      <div className="w-full flex gap-6">
        <div className="w-[80%] bg-white shadow-lg rounded-lg p-6 mb-6">
          <h1 className="text-2xl font-bold mb-2">Assessment Report</h1>
          <p className="text-gray-600 mb-4">You Are Currently On</p>
          <h2 className="text-xl font-semibold mb-4">{formData.gender === "Male" ? `1 Of Male Pattern  ${formData.healthConcern}` : "Female Pattern Hair Loss"}</h2>
          
          <div className="mb-6">
            <p className="font-medium text-gray-700 mb-2">Treatment Duration</p>
            <p className="text-lg font-semibold">2 Months</p>
          </div>

          <div className="mb-6">
            <p className="font-medium text-gray-700 mb-2">Hair Regrowth Possibility</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-green-600 h-2.5 rounded-full" style={{ width: "100%" }}></div>
            </div>
            <p className="text-right text-sm text-gray-600 mt-1">100%</p>
          </div>

        {/* Assessment Answers Section */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Your Assessment Details</h2>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {formData.gender === "Male" && responses.healthConcern === "Hair Loss" && (
              <>
                <div className="p-4 rounded-lg bg-gray-50">
                  <p className="font-medium text-gray-700 mb-2">Hair Stage</p>
                  <div className="flex items-center space-x-3">
                    {imageMap.hairStage[responses.hairStage] && (
                      <img src={imageMap.hairStage[responses.hairStage]} alt="Hair Stage" className="w-16 h-16 object-cover rounded" />
                    )}
                    <span className="text-gray-800">{responses.hairStage}</span>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-gray-50">
                  <p className="font-medium text-gray-700 mb-2">Dandruff Status</p>
                  <div className="flex items-center space-x-3">
                    {imageMap.dandruff[responses.dandruff] && (
                      <img src={imageMap.dandruff[responses.dandruff]} alt="Dandruff Status" className="w-16 h-16 object-cover rounded" />
                    )}
                    <div>
                      <span className="text-gray-800">{responses.dandruff}</span>
                      {responses.dandruff === "Yes" && (
                        <p className="text-sm text-gray-600 mt-1">Stage: {responses.dandruffStage}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-gray-50">
                  <p className="font-medium text-gray-700 mb-2">Energy Levels</p>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${responses.energyLevels === "High" ? "bg-green-500" : responses.energyLevels === "Medium" ? "bg-yellow-500" : "bg-red-500"}`}></div>
                    <span className="text-gray-800">{responses.energyLevels}</span>
                  </div>
                </div>
              </>
            )}

            {formData.gender === "Male" && responses.healthConcern === "Beard Growth" && (
              <div className="p-4 rounded-lg bg-gray-50">
                <p className="font-medium text-gray-700 mb-2">Health Concern</p>
                <div className="flex items-center space-x-3">
                  {imageMap.healthConcern[responses.healthConcern] && (
                    <img src={imageMap.healthConcern[responses.healthConcern]} alt="Health Concern" className="w-16 h-16 object-cover rounded" />
                  )}
                  <span className="text-gray-800">{responses.healthConcern}</span>
                </div>
              </div>
            )}

            {formData.gender === "Female" && (
              <>
                <div className="p-4 rounded-lg bg-gray-50">
                  <p className="font-medium text-gray-700 mb-2">Natural Hair Type</p>
                  <div className="flex items-center space-x-3">
                    {imageMap.naturalHair[responses.naturalHair] && (
                      <img src={imageMap.naturalHair[responses.naturalHair]} alt="Natural Hair" className="w-16 h-16 object-cover rounded" />
                    )}
                    <span className="text-gray-800">{responses.naturalHair}</span>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-gray-50">
                  <p className="font-medium text-gray-700 mb-2">Hair Goal</p>
                  <span className="text-gray-800">{responses.goal}</span>
                </div>

                <div className="p-4 rounded-lg bg-gray-50">
                  <p className="font-medium text-gray-700 mb-2">Hair Fall Status</p>
                  <span className="text-gray-800">{responses.hairFall}</span>
                </div>

                <div className="p-4 rounded-lg bg-gray-50">
                  <p className="font-medium text-gray-700 mb-2">Main Concern</p>
                  <span className="text-gray-800">{responses.healthConcern}</span>
                </div>
              </>
            )}
             

          {/* {formData.gender === "Female" && (
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
          )} */}
          </div>

         
        </div>
        </div>

        <div className="w-[45%]">
          {/* Recommendation Section */}
          {recommendation && (
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Your Treatment is</h2>
              <div className="space-y-4">
                {recommendation.products?.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-all">
                    <div className="flex items-center space-x-4">
                      {productImages[product] && (
                        <div className="w-20 h-20 flex-shrink-0">
                          <img
                            src={productImages[product]}
                            alt={product}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-lg">{product}</h3>
                        <div className="text-sm text-orange-500 font-medium mt-1">
                          {product === "Sinibis" && "Dandruff"}
                          {product === "Minoxidil 5%" && "Genetics"}
                          {product === "Biotin Gummies" && "Nutrition"}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {product === "Sinibis" && "Clinically proven molecule for dandruff"}
                          {product === "Minoxidil 5%" && "Prevents DHT led hair damage"}
                          {product === "Biotin Gummies" && "Delicious gummies packed with hair growth nutrients"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-lg">
                        {product === "Sinibis" && "₹399.00"}
                        {product === "Minoxidil 5%" && "₹650.00"}
                        {product === "Biotin Gummies" && "₹600.00"}
                      </p>
                    </div>
                  </div>
                ))}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Subtotal<br/><span className="text-xs">(inclusive of all taxes)</span></span>
                    <span className="font-semibold text-xl">₹1650.00</span>
                  </div>
                </div>
                <button className="w-full py-3 bg-[#8BC34A] text-white rounded-lg font-medium hover:bg-[#7CB342] transition-colors">
                  Buy Now
                </button>
                <p className="text-center text-sm text-gray-500 mt-2">All of our products are GMP & ISO 9001 certified</p>
              </div>

              {recommendation.advice && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <p className="text-lg font-medium text-green-600 mb-4 text-center">Expert Advice</p>
                  <ul className="space-y-3">
                    {recommendation.advice.map((tip, index) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-block w-6 h-6 bg-green-100 rounded-full flex-shrink-0 flex items-center justify-center mr-3 mt-1">
                          <span className="text-green-600 text-sm">{index + 1}</span>
                        </span>
                        <p className="text-gray-800 flex-grow">{tip}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <button
            onClick={() => navigate("/")}
            className="w-full py-3 mt-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
          >
            Back to Assessment
          </button>
        </div>
      </div>
    </div>
    
  )
  
}

export default RecommendationPage

