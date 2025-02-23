import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // For redirection
import useStore from './store'; // Zustand store
import axios from 'axios';

const RecommendationPage = () => {
  const { formData, responses } = useStore();
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
      const userId = localStorage.getItem('userId'); // Get userId from local storage

      if (!userId) {
        setError('Server Error in Loading!!'); // Set error message
        setLoading(false); // Stop loading
        return; // Exit the function
      }

      const response = await axios.post("http://localhost:5000/api/recommend", {
        userId, // Use the userId from local storage
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

      setRecommendation(response.data);

      // Remove userId from local storage after use
      localStorage.removeItem('userId');
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

      <div className="w-full flex max-w-6xl gap-12">
        <div className='flex flex-col w-1/2 gap-3'>
          {/* Personal Information Section */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold text-green-700 mb-4">Personal Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-medium">Name:</p>
                <p className="text-gray-600">{formData.name}</p>
              </div>
              <div>
                <p className="font-medium">Age:</p>
                <p className="text-gray-600">{formData.age}</p>
              </div>
              <div>
                <p className="font-medium">Email:</p>
                <p className="text-gray-600">{formData.email}</p>
              </div>
              <div>
                <p className="font-medium">Phone:</p>
                <p className="text-gray-600">{formData.phone}</p>
              </div>
              <div>
                <p className="font-medium">Gender:</p>
                <p className="text-gray-600">{formData.gender}</p>
              </div>
            </div>
          </div>

          {/* Assessment Answers Section */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold text-green-700 mb-4">Your Issues</h2>
            <div className="grid grid-cols-2 gap-4">
              {formData.gender === 'Male' && (
                <>
                  <div>
                    <p className="font-medium">Health Concern:</p>
                    <p className="text-gray-600">{responses.healthConcern}</p>
                  </div>
                  {(responses.healthConcern === 'Hair Loss') && (
                    <>
                      <div>
                        <p className="font-medium">Hair Stage:</p>
                        <p className="text-gray-600">{responses.hairStage}</p>
                      </div>
                      <div>
                        <p className="font-medium">Dandruff:</p>
                        <p className="text-gray-600">{responses.dandruff}</p>
                      </div>
                      {(responses.dandruff === 'Yes') && (
                        <div>
                          <p className="font-medium">Dandruff Stage:</p>
                          <p className="text-gray-600">{responses.dandruffStage}</p>
                        </div>
                      )}
                      <div>
                        <p className="font-medium">Energy Levels:</p>
                        <p className="text-gray-600">{responses.energyLevels}</p>
                      </div>
                    </>
                  )}
                </>
              )}

              {formData.gender === 'Female' && (
                <>
                  <div>
                    <p className="font-medium">Natural Hair Type:</p>
                    <p className="text-gray-600">{responses.naturalHair}</p>
                  </div>
                  <div>
                    <p className="font-medium">Hair Goal:</p>
                    <p className="text-gray-600">{responses.goal}</p>
                  </div>
                  <div>
                    <p className="font-medium">Hair Fall:</p>
                    <p className="text-gray-600">{responses.hairFall}</p>
                  </div>
                  <div>
                    <p className="font-medium">Main Concern:</p>
                    <p className="text-gray-600">{responses.mainConcern}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className='flex flex-col w-1/2'>
          {/* Recommendation Section */}
          {recommendation && (
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-xl font-semibold text-green-700 mb-4">Your Personalized Recommendation</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-lg font-medium text-green-600">Recommended Kit:</p>
                  <p className="text-gray-800 text-xl">{recommendation.kit}</p>
                </div>
                <div>
                  <p className="text-lg font-medium text-green-600">Recommended Products:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    {recommendation.products?.map((product, index) => (
                      <li key={index} className="text-gray-800">{product}</li>
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
