"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useStore from "./store";
import axios from "axios";
import sH from "./pics/sexualHealth.png";
import bW from "./pics/beardGrowth.png";
import hL from "./pics/hairloss.png";
import s1 from "./pics/stage-1.png";
import s2 from "./pics/stage-2.png";
import s3 from "./pics/stage-3.png";
import s4 from "./pics/stage-4.png";
import s5 from "./pics/stage-5.png";
import s6 from "./pics/stage-6.png";
import s7 from "./pics/stage-7.png";
import dn from "./pics/dandruffNo.png";
import dy from "./pics/dandruffYes.jpg";
import sth from "./pics/stH.png";
import wy from "./pics/wavyHair.jpg";
import cy from "./pics/curlyHair.jpg";
import co from "./pics/coilyHair.png";
import Gummies from "./pics/gummies.jpg";
import Sinibis from "./pics/sinibis.jpg";
import shilajit from "./pics/shilajit.jpg";
import hgw from "./pics/hairGrowthSerum.jpg";
import minibis from "./pics/minibis.jpg";
import shampoo from "./pics/anti-dandruff(ketoconazole-shampoo).jpg"


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
  };

  const productImages = {
    Gummies: Gummies,
    "Biotin Gummies": Gummies,
    Sinibis: Sinibis,
    "Minoxidil 5%": minibis,
    "Hair Growth Serum": hgw,
    Shilajit: shilajit,
    Shampoo: shampoo,
  };

  const { formData, responses, userId } = useStore();
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const recommendedKits = [
    {
      name: 'Basic Hair Growth Kit',
      url: "https://nonucare.com/products/the-classic-hair-kit?_pos=2&_sid=77a3f7455&_ss=r"
    },
    {
      name: 'Complete Hair Growth Kit',
      url: 'https://nonucare.com/products/the-complete-hair-kit?_pos=1&_sid=9a06b0998&_ss=r'
    },
    {
      name: 'Anti-Dandruff Kit',
      url: 'https://nonucare.com/products/anti-dandruff-kit?_pos=1&_sid=970e5b4fb&_ss=r'
    },
  ];
  

  useEffect(() => {
    // Check if we have the required data
    if (!formData || !responses) {
      console.log("Missing form data, redirecting to form");
      navigate("/");
      return;
    }

    const fetchData = async () => {
      try {
        await fetchRecommendation();
      } catch (error) {
        console.error("Error fetching recommendation:", error);
      }
    };

    fetchData();
  }, [formData, responses]);

  const fetchRecommendation = async () => {
    setLoading(true);
    setError("");

    try {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        setError("User ID not found. Please complete the assessment first.");
        setLoading(false);
        return;
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
        medicalConditions: responses.medicalConditions, // Add this
        planningForBaby: responses.planningForBaby, // Add this
      });
      localStorage.removeItem("userId");
      setRecommendation(response.data);
      console.log("Recommendation:", response.data);
    } catch (error) {
      console.error("Recommendation error:", error);
      setError("Error generating recommendations. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-center p-6 bg-white rounded-lg shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-xl font-medium text-gray-700">
            Loading your personalized recommendations...
          </p>
        </div>
      </div>
    );
  }

  // Update the main container and layout styles
  return (
    <div className="flex flex-col items-center p-2 sm:p-4 md:p-6 bg-gray-100 min-h-screen">
      <div className="w-full flex flex-col lg:flex-row gap-4 lg:gap-6 max-w-7xl mx-auto">
        {/* Left Section - Assessment Details */}
        
        <div className="w-full lg:w-[60%] bg-white shadow-lg rounded-lg p-4 sm:p-6 mb-4 lg:mb-0">
          {/* User Info Header */}
          <div className="border-b pb-4 mb-6">
          
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-xl sm:text-2xl font-bold">Assessment Report</h1>
             
            </div>
            <div className="flex items-center justify-between">
              <p className="text-gray-600">You Are Currently On</p>
             
            </div>
            <h2 className="text-lg sm:text-xl font-semibold mt-2 text-green-600">
              {formData.gender === "Male"
                ? `Male Pattern ${formData.healthConcern}`
                : "Female Pattern Hair Loss"}
            </h2>
          </div>

          {/* Assessment Details Section */}
          <div className="bg-white rounded-lg">
            <h2 className="text-lg sm:text-xl font-semibold mb-6 text-gray-800">
              Your Assessment Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {formData.gender === "Male" &&
                responses.healthConcern === "Hair Loss" && (
                  <>
                    <div className="p-4 rounded-lg bg-gray-50">
                      <p className="font-medium text-gray-700 mb-2">
                        Hair Stage
                      </p>
                      <div className=" flex lg:flex-col items-center space-x-3">
                        {imageMap.hairStage[responses.hairStage] && (
                          <img
                            src={imageMap.hairStage[responses.hairStage]}
                            alt="Hair Stage"
                            className="w-16 h-16 lg:w-24 lg:h-24 object-cover rounded"
                          />
                        )}
                        <span className="text-gray-800">
                          {responses.hairStage}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-gray-50">
                      <p className="font-medium text-gray-700 mb-2">
                        Dandruff Status
                      </p>
                      <div className="flex lg:flex-col items-center space-x-3">
                        {imageMap.dandruff[responses.dandruff] && (
                          <img
                            src={imageMap.dandruff[responses.dandruff]}
                            alt="Dandruff Status"
                            className="w-16 h-16 lg:w-24 lg:h-24 object-cover rounded"
                          />
                        )}
                        <div>
                          <span className="text-gray-800">
                            {responses.dandruff}
                          </span>
                          {responses.dandruff === "Yes" && (
                            <p className="text-sm text-gray-600 mt-1">
                              Stage: {responses.dandruffStage}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-gray-50">
                      <p className="font-medium text-gray-700 mb-2">
                        Energy Levels
                      </p>
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            responses.energyLevels === "High"
                              ? "bg-green-500"
                              : responses.energyLevels === "Medium"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                        ></div>
                        <span className="text-gray-800">
                          {responses.energyLevels}
                        </span>
                      </div>
                    </div>

                    {responses.medicalConditions && (
                      <div className="p-4 rounded-lg bg-gray-50">
                        <p className="font-medium text-gray-700 mb-2">Medical Conditions</p>
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              responses.medicalConditions
                                ? "bg-red-500"
                                : "bg-green-500"
                            }`}
                          ></div>
                          <span className="text-gray-800">
                            {responses.medicalConditions}
                          </span>
                        </div>
                      </div>
                    )}
                  </>
                )}

              {formData.gender === "Male" &&
                responses.healthConcern === "Beard Growth" && (
                  <div className="p-4 rounded-lg bg-gray-50">
                    <p className="font-medium text-gray-700 mb-2">
                      Health Concern
                    </p>
                    <div className="flex items-center space-x-3">
                      {imageMap.healthConcern[responses.healthConcern] && (
                        <img
                          src={imageMap.healthConcern[responses.healthConcern]}
                          alt="Health Concern"
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <span className="text-gray-800">
                        {responses.healthConcern}
                      </span>
                    </div>
                  </div>
                )}

              {formData.gender === "Female" && (
                <>
                  <div className="p-4 rounded-lg bg-gray-50">
                    <p className="font-medium text-gray-700 mb-2">
                      Natural Hair Type
                    </p>
                    <div className="flex items-center space-x-3">
                      {imageMap.naturalHair[responses.naturalHair] && (
                        <img
                          src={imageMap.naturalHair[responses.naturalHair]}
                          alt="Natural Hair"
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <span className="text-gray-800">
                        {responses.naturalHair}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-gray-50">
                    <p className="font-medium text-gray-700 mb-2">Hair Goal</p>
                    <span className="text-gray-800">{responses.goal}</span>
                  </div>

                  <div className="p-4 rounded-lg bg-gray-50">
                    <p className="font-medium text-gray-700 mb-2">
                      Hair Fall Status
                    </p>
                    <span className="text-gray-800">{responses.hairFall}</span>
                  </div>

                  <div className="p-4 rounded-lg bg-gray-50">
                    <p className="font-medium text-gray-700 mb-2">
                      Main Concern
                    </p>
                    <span className="text-gray-800">
                      {responses.healthConcern}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Section - Recommendations */}
        <div className="w-full lg:w-[40%] space-y-4">
          {recommendation && (
            <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6">
              <div className="border-b pb-4 mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                  Recommended Treatment
                </h2>
                <p className="text-green-600 font-medium mt-2">{recommendation.kit}</p>
              </div>

              {/* Warning Section with improved styling */}
              {recommendation.warning && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start">
                    <span className="text-yellow-500 text-xl mr-3">⚠️</span>
                    <p className="text-yellow-700 text-sm sm:text-base">
                      {recommendation.warning}
                    </p>
                  </div>
                </div>
              )}

              {/* Products Section */}
              <div className="space-y-4">
                {recommendation.products?.map((product, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg hover:shadow-md transition-all"
                  >
                    {productImages[product] && (
                      <div className="w-full sm:w-24 h-24 flex-shrink-0">
                        <img
                          src={productImages[product]}
                          alt={product}
                          className="w-full h-full object-contain rounded-lg"
                        />
                      </div>
                    )}
                    <div className="flex-grow">
                      <h3 className="font-semibold text-gray-800">{product}</h3>
                      <div className="text-sm text-orange-500 font-medium mt-1">
                        {product === "Sinibis" && "Dandruff"}
                        {product === "Minoxidil 5%" && "Genetics"}
                        {product === "Biotin Gummies" && "Nutrition"}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {product === "Sinibis" &&
                          "Clinically proven molecule for dandruff"}
                        {product === "Minoxidil 5%" &&
                          "Prevents DHT led hair damage"}
                        {product === "Biotin Gummies" &&
                          "Delicious gummies packed with hair growth nutrients"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Buy Now Section */}
              <div className="mt-6 pt-4 border-t">
                {recommendedKits
                  .filter((kit) => kit.name === recommendation.kit)
                  .map((kit) => (
                    <div key={kit.name} className="space-y-3">
                      <a
                        href={kit.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <button className="bg-green-600 py-3 px-6 rounded-lg w-full text-white font-medium hover:bg-green-700 transition-colors">
                          Buy Now
                        </button>
                      </a>
                    </div>
                  ))}
              </div>

              {/* Expert Advice Section with improved styling */}
              {recommendation.advice && (
                <div className="mt-6 pt-6 border-t">
                  <p className="text-lg font-medium text-green-600 mb-4">
                    Expert Advice
                  </p>
                  <ul className="space-y-4">
                    {recommendation.advice.map((tip, index) => (
                      <li key={index} className="flex items-start">
                        <span className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-green-600 text-sm font-medium">
                            {index + 1}
                          </span>
                        </span>
                        <p className="text-gray-700 text-sm flex-grow">{tip}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Back Button with improved styling */}
          <button
            onClick={() => navigate("/")}
            className="w-full py-3 px-6 bg-gray-800 text-white rounded-lg hover:bg-gray-700 focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors font-medium"
          >
            Back to Assessment
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecommendationPage;
