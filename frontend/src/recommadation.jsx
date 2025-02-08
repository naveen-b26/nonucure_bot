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
      const requestData = {
        stage: formData.hairStage ||responses.hairStage,
        dandruffLevel: formData.dandruffStage || responses.dandruffLevel,
        energyLevel: formData.energyLevels || responses.energyLevels,
      };

      console.log('Sending request with data:', requestData);
      
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/recommend`, requestData);
      
      if (response.data.message) {
        setError(response.data.message);
        setRecommendation(null);
      } else {
        setRecommendation(response.data);
      }
    } catch (error) {
      console.error('Recommendation error:', error);
      setError('Error fetching recommendation. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center text-xl">Loading...</div>;

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-green-600 mb-6">Your Hair Care Recommendation</h1>

      {error && <div className="text-red-500 text-lg mb-4">{error}</div>}

      {recommendation ? (
        <div className="bg-white shadow-lg rounded-lg p-6 w-full sm:w-[600px]">
          <h2 className="text-xl font-semibold text-green-700 mb-4">Recommended Kit: {recommendation.kit}</h2>
          <ul className="list-disc pl-6 text-lg">
            {recommendation.products?.map((product, index) => (
              <li key={index} className="mb-2">{product}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="text-lg text-center mt-6">Please wait while we generate your recommendation...</div>
      )}

      <button
        onClick={() => navigate('/')}
        className="mt-6 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        Back to Form
      </button>
    </div>
  );
};

export default RecommendationPage;
