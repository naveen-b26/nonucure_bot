import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // For redirection
import useStore from './store'; // Zustand store
import axios from 'axios';
import sH from './pics/sexualHealth.png';
import bW from './pics/beardGrowth.png';
import hL from './pics/hairloss.png';
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
import Gummies from './pics/gummies.jpg'
import Sinibis from "./pics/sinibis.jpg"
import shilajit from './pics/shilajit.jpg';
import hgw from './pics/hairGrowthSerum.jpg'
import minibis from './pics/minibis.jpg'
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
      "Straight": sth,
      "Wavy": wy,
      "Curly": cy,
      "Coily": co,
    },


  };
  const productImages = {
    "Gummies": Gummies,
    "Biotin Gummies":Gummies,
    "Sinibis": Sinibis,
    "Minoxidil 5%": minibis,
    "Hair Growth Serum": hgw,
    "Shilajit": shilajit,
  };


  const { formData, responses, userId } = useStore();
  console.log(formData, responses, userId)
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have the required data
    if (!formData || !responses) {
      console.log('Missing form data, redirecting to form');
      navigate('/');
      return;
    }
    fetchRecommendation();
  }, []); // Run once on mount
  const fetchRecommendation = async () => {
    setLoading(true);
    setError('');

    try {
      const userId = localStorage.getItem('userId');
      console.log('UserId from storage:', userId);

      if (!userId) {
        setError('User ID not found. Please complete the assessment first.');
        setLoading(false);
        return;
      }

      const response = await axios.post(`${process.env.api_end_key}/recommend`, {
        userId: userId,  // Add userId to the request body
        gender: formData.gender,
        healthConcern: responses.healthConcern,
        hairStage: responses.hairStage,
        dandruff: responses.dandruff,
        dandruffStage: responses.dandruffStage,
        energyLevels: responses.energyLevels,
        naturalHair: responses.naturalHair,
        goal: responses.goal,
        hairFall: responses.hairFall,
        mainConcern: responses.mainConcern
      });
      localStorage.removeItem('userId');
      setRecommendation(response.data);
    } catch (error) {
      console.error('Recommendation error:', error);
      setError('Error generating recommendations. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  if (loading) return <div className="text-center text-xl">Loading...</div>;
  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-green-600 mb-6">Your Hair Care Journey</h1>

      {error && <div className="text-red-500 text-lg mb-4">{error}</div>}

      <div className="max-w-6xl flex gap-12">
        <div className='flex flex-col justify-center w-full gap-3'>
          {/* Personal Information Section */}
          <div className="bg-white shadow-lg rounded-lg p-6 text-center">
            <h2 className='text-2xl '>Hey {formData.name}!!</h2>
            <p className='text-green-600'>Lets review your concers!</p>
          </div>
          {/* Assessment Answers Section */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold text-green-700 mb-4 text-center">Your Issues</h2>
            <div className="flex grid-cols-3 justify-center  items-center gap-[40px] p-6">
              {formData.gender === 'Male' && (
                <>
                  <div className='flex flex-col gap-3'>
                    <p className="font-medium">Health Concern:</p>
                    <div className="flex flex-col-reverse items-center gap-2">
                      <p className="text-gray-600">{responses.healthConcern}</p>
                      {imageMap.healthConcern[responses.healthConcern] && (
                        <img src={imageMap.healthConcern[responses.healthConcern]} alt="Health Concern" className="w-40 h-40" />
                      )}
                    </div>
                  </div>

                  {responses.healthConcern === 'Hair Loss' && (
                    <>
                      <div className='flex flex-col gap-3'>
                        <p className="font-medium">Hair Stage:</p>
                        <div className="flex flex-col-reverse items-center gap-2">
                          <p className="text-gray-600">{responses.hairStage}</p>
                          {imageMap.hairStage[responses.hairStage] && (
                            <img src={imageMap.hairStage[responses.hairStage]} alt="Hair Stage" className="w-40 h-40" />
                          )}
                        </div>
                      </div>

                      <div className='flex flex-col gap-3'>
                        <p className="font-medium">Dandruff:</p>
                        <div className="flex flex-col-reverse items-center gap-2">
                          <p className="text-gray-600">{responses.dandruff}</p>
                          {imageMap.dandruff[responses.dandruff] && (
                            <img src={imageMap.dandruff[responses.dandruff]} alt="Dandruff" className="w-40 h-40" />
                          )}
                        </div>
                      </div>

                      {responses.dandruff === 'Yes' && (
                        <div>
                          <p className="font-medium">Dandruff Stage:</p>
                          <div className="flex items-center gap-2">
                            <p className="text-gray-600">{responses.dandruffStage}</p>

                          </div>
                        </div>
                      )}

                      <div>
                        <p className="font-medium">Energy Levels:</p>
                        <div className="flex items-center gap-2">
                          <p className="text-gray-600">{responses.energyLevels}</p>

                        </div>
                      </div>
                    </>
                  )}
                </>
              )}

              {formData.gender === 'Female' && (
                <>
                  <div>
                    <p className="font-medium">Natural Hair Type:</p>
                    <div className="flex-col-reverse justify-center items-center gap-2">
                      {imageMap.naturalHair[responses.naturalHair] && (
                        <img src={imageMap.naturalHair[responses.naturalHair]} alt="Hair Type" className="w-24 h-24" />
                      )}
                      <p className="text-gray-600 px-6">{responses.naturalHair}</p>

                    </div>
                  </div>

                  <div>
                    <p className="font-medium">Hair Goal:</p>
                    <div className="flex items-center gap-2">
                      <p className="text-gray-600">{responses.goal}</p>

                    </div>
                  </div>

                  <div>
                    <p className="font-medium">Hair Fall:</p>
                    <div className="flex items-center gap-2">
                      <p className="text-gray-600">{responses.hairFall}</p>
                    </div>
                  </div>

                  <div>
                    <p className="font-medium">Main Concern:</p>
                    <div className="flex items-center gap-2">
                      <p className="text-gray-600">{responses.healthConcern}</p>
                    </div>
                  </div>
                </>
              )}
            </div>

          </div>
        </div>


        <div className='flex flex-col w-full'>
          {/* Recommendation Section */}
          {recommendation && (
            <div className="bg-white shadow-lg rounded-lg p-6 text-center">
              <h2 className="text-xl font-semibold text-green-700 mb-4">Your Personalized Recommendation</h2>
              <hr></hr>
              <div className="space-y-4">
                <div>
                  <p className="text-lg font-medium text-green-600">Recommended Kit:</p>
                  <p className="text-gray-800 text-xl">{recommendation.kit}</p>
                </div>
                <div>
                  <p className="text-lg font-medium text-green-600">Recommended Products:</p>
                  <ul className=" pl-6 space-y-2 flex  justify-center grid-cols-3 gap-2">
                    {recommendation.products?.map((product, index) => (
                      <li key={index} className="text-gray-800 flex-col items-center gap-2 text-center">
                        {productImages[product] && (
                          <img src={productImages[product]} alt={product} className="w-30 h-27 cover rounded-md" />
                        )}
                        {product}
                      </li>
                    ))}
                  </ul>

                </div>
                {recommendation.advice && (
                  <div>
                    <p className="text-lg font-medium text-green-600">Expert Advice:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      {recommendation.advice.map((tip, index) => (
                        <li key={index} className="text-gray-800">{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          <button
            onClick={() => navigate('/')}
            className="w-full mt-6 py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
          >
            Back to Assessment
          </button>
        </div>
      </div>
    </div>

  );
};

export default RecommendationPage;
