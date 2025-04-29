"use client";

import { useState, useEffect, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import useStore from "./store";
import axios from "axios";
import { Dialog, Transition } from '@headlessui/react';
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
import shampoo2 from "./pics/anti-dandruff(conditioner).jpg"
import finibis from "./pics/finibis.png"
import finasteride from "./pics/finasteride.jpg"
import { motion } from "framer-motion";
import { RocketLaunchIcon, StarIcon, LockClosedIcon } from '@heroicons/react/24/solid';

const RECOVERY_PERCENTAGE = 98;
const TIMELINE_MONTHS = "3-4";

const LockedFeature = ({ title, onClick }) => {
  const [isHovering, setIsHovering] = useState(false);
  
  return (
    <motion.div
      onHoverStart={() => setIsHovering(true)}
      onHoverEnd={() => setIsHovering(false)}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 transition-all relative"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-gray-800 font-medium">{title}</h3>
        <motion.div
          animate={{ rotate: isHovering ? [0, -20, 20, -20, 20, 0] : 0 }}
          transition={{ duration: 0.5 }}
        >
          <LockClosedIcon className="w-5 h-5 text-gray-400" />
        </motion.div>
      </div>
      <p className="text-sm text-gray-500 mt-1">
        Unlock after starting treatment! 
      </p>
    </motion.div>
  );
};

const UnlockDialog = ({ isOpen, closeModal }) => (
  <Transition appear show={isOpen} as={Fragment}>
    <Dialog as="div" className="relative z-10" onClose={closeModal}>
      <Transition.Child
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 bg-black bg-opacity-25" />
      </Transition.Child>

      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <Dialog.Title
                as="h3"
                className="text-lg font-medium leading-6 text-gray-900"
              >
                Unlock Premium Features
              </Dialog.Title>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Purchase our recommended kit to unlock:
                  <ul className="list-decimal ml-4 mt-2">
                    <li>Detailed Doctor's Prescription</li>
                    <li>Personalized Diet Plan</li>
                    <li>Progress Tracking</li>
                    <li>Expert Support</li>
                  </ul>
                </p>
              </div>

              <div className="mt-4">
                <button
                  type="button"
                  className="inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                  onClick={closeModal}
                >
                  Got it, thanks!
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </div>
    </Dialog>
  </Transition>
);

// Update the MoneyBackGuarantee component to include the name
const MoneyBackGuarantee = ({ userName }) => (
  <div className="bg-gray-50 shadow-sm rounded-lg p-6 text-center mb-4">
    <div className="flex justify-center mb-4">
      <svg className="w-12 h-12 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-1-5h2v2h-2v-2zm0-8h2v6h-2V7z"/>
      </svg>
    </div>
    <h3 className="text-xl text-gray-700 mb-2">
      {userName}, we've got you covered!
    </h3>
    <p className="text-2xl font-bold text-gray-800 mb-4">
      If the solution doesn't work out, we'll refund your money.
    </p>
    
  </div>
);

const ProgressBar = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(RECOVERY_PERCENTAGE);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="bg-green-600 h-2 rounded-full"
      />
    </div>
  );
};

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
    "Ketonazole 1% Shampoo": shampoo,
    "Anti-Dandruff Conditioner": shampoo2,
    Finibis: finibis,
    Finasteride:finasteride,
  };

  const { formData, responses, userId } = useStore();
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const recommendedKits = [
    {
      name: 'Classic Kit',
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
    {
      name: 'Mothers Hair Growth Kit',
      url: 'https://nonucare.com/products/mother-s-hair-growth-kit?_pos=1&_psq=mothers+hair+grow&_ss=e&_v=1.0'
    }
  ];

  const [isUnlockDialogOpen, setIsUnlockDialogOpen] = useState(false);

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
        planningForBaby: responses.planningForBaby,
      });
      localStorage.removeItem("userId");
      setRecommendation(response.data);
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
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Hi, {formData.name} 👋
                </h1>
                <p className="text-gray-600 mt-1">
                  Here's your personalized hair care assessment
                </p>
              </div>
            </div>
            <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-100">
              <h2 className="text-lg font-medium text-gray-800">
                Current Condition:
                <span className="text-green-600 ml-2">
                  {formData.gender === "Male"
                    ? `Male Pattern ${formData.healthConcern}`
                    : "Your issue"}
                </span>
              </h2>
            </div>
          </div>

          {/* Update the Recovery Timeline section with more personalization */}
          <div className="mt-2 mb-6 bg-white shadow-sm rounded-lg p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Your Recovery Journey</h3>
              <span className="text-sm text-gray-500">Personalized for {formData.name}</span>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Treatment Progress</span>
                  <span className="font-medium">{RECOVERY_PERCENTAGE}%</span>
                </div>
                <ProgressBar />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Expected Timeline:</span>
                <span className="text-green-600 font-medium">{TIMELINE_MONTHS} months</span>
              </div>
              <p className="text-xs text-gray-500 italic mt-2">
                *Results may vary based on individual response to treatment
              </p>
            </div>
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
                          className={`w-3 h-3 rounded-full ${responses.energyLevels === "High"
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
                            className={`w-3 h-3 rounded-full ${responses.medicalConditions
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
        
          <LockedFeature
            title="Doctor's Prescription"
            onClick={() => setIsUnlockDialogOpen(true)}
          />
          <LockedFeature
            title="Personalized Diet Plan"
            onClick={() => setIsUnlockDialogOpen(true)}
          />

          <UnlockDialog
            isOpen={isUnlockDialogOpen}
            closeModal={() => setIsUnlockDialogOpen(false)}
          />
          {/* Add MoneyBackGuarantee component */}
          {recommendation && !recommendation.needsDoctor && (
            <MoneyBackGuarantee userName={formData.name} />
          )}
        </div>

        {/* Right Section - Recommendations */}
        <div className="w-full lg:w-[40%] space-y-4">
          {recommendation && (
            <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6">
              {/* Update the recommendation section header in the right column */}
              <div className="border-b pb-4 mb-6">
                <div className="flex flex-col items-center text-center">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                    {recommendation.needsDoctor ? 'Medical Attention Required' : 'Your Personalized Treatment Plan'}
                  </h2>
                  <p className="text-gray-600">
                    Customized for {formData.name}'s hair care needs
                  </p>
                </div>
              </div>

              {recommendation.needsDoctor ? (
                // Simple message display for doctor consultation
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-red-700 text-base">
                    {recommendation.message}
                  </p>
                  <p className="text-red-600 mt-4 font-medium">
                    Please consult with a qualified dermatologist for proper medical attention.
                  </p>
                </div>
              ) : (
                <>
                  <div className="relative">
                    
                      <div className="absolute -top-5 right-0 font-bold bg-white text-green-400 text-xs px-3 py-1 rounded-full shadow-sm border-2 border-white ring-2 ring-green-400">
                        Top Pick ⭐
                      </div>
                    
                    <p className="text-green-600 border-[1px] py-2 border-green-400 rounded-xl flex items-center justify-center text-4xl text-center font-bold mb-2">
                      {recommendation.kit}
                    </p>
                  </div>
                  {/* Add this before the product listings */}
                  <div className="text-center mb-8">
                    <p className="text-gray-600 text-lg mb-4">
                      Based on your unique assessment, we curated this kit for you!
                    </p>
                    <div className="flex items-center justify-center text-green-600 text-xl font-medium">
                     
                      Products in this kit:
                    </div>
                  </div>
                  {/* ...existing products section... */}
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
                  {/* {recommendation.note && (
                    <div className="mt-4 mb-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start">
                        <span className="text-blue-500 text-xl mr-3">ℹ️</span>
                        <p className="text-blue-700 text-sm sm:text-base">
                          {recommendation.note}
                        </p>
                      </div>
                    </div>
                  )} */}
                  {/* ...rest of your existing recommendation display... */}
                  <div className="space-y-2">
                    {recommendation.products?.map((product, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ 
                          y: -5,
                          transition: { duration: 0.2 }
                        }}
                        className="flex flex-col sm:flex-row gap-4 p-4 border border-green-100 rounded-lg hover:shadow-lg transition-all relative group"
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
                            {product ==="Finibis" && "For baldness and Hair density"}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {product === "Sinibis" &&
                              "Clinically proven molecule for dandruff"}
                            {product === "Minoxidil 5%" &&
                              "Prevents DHT led hair damage"}
                            {product === "Biotin Gummies" &&
                              "Delicious gummies packed with hair growth nutrients"}
                            {product === "gummies" && "Essential vitamins & minerals for hair growth"}
                            {product ==="Finibis" && "Stops baldness and promotes hair growth and improve hair density by 20%"}
                          </p>
                          
                          {/* Add trust indicators */}
                          <div className="mt-3 flex items-center text-sm text-gray-500">
                            <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                            <span>4.8/5</span>
                            <span className="mx-2">•</span>
                            <span>Trusted by 500+ users</span>
                          </div>
                          
                         
                        </div>
                        
                        {/* Hover tooltip */}
                        <div className="absolute invisible group-hover:visible bg-gray-800 text-white text-xs p-2 rounded-md -top-8 left-1/2 transform -translate-x-1/2">
                          Click to know more about how it helps
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Buy Now Section */}
                  <div className="mt-6 pt-4 border-t">
                    <div className="text-center mb-4">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="text-green-600 text-xl font-medium flex items-center justify-center"
                      >
                        <RocketLaunchIcon className="h-6 w-6 mr-2" />
                        Begin your hair growth journey today!
                      </motion.div>
                    </div>
                    {recommendedKits
                      .filter((kit) => kit.name === recommendation.kit)
                      .map((kit) => (
                        <motion.div
                          key={kit.name}
                          whileHover={{ scale: 1.02 }}
                          className="space-y-3"
                        >
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
                        </motion.div>
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

                  

                </>
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
