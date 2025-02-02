import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // For redirection
import useStore from './store'; // Zustand store
import axios from 'axios';

const RecommendationPage = () => {
  const { formData, responses } = useStore(); // Access form data and responses from Zustand
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  console.log(formData)
  useEffect(() => {
    if (!formData && !responses) {
      navigate('/'); // Redirect back to the form if there's no data
    }
  }, [formData, responses, navigate]);

  const fetchRecommendation = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/recommend', {
        ...formData, // Send all form data
        ...responses, // Send all responses to the backend
      });

      setRecommendation(response.data); // Store the response (recommendation)
    } catch (error) {
      setError('Error fetching recommendation. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Trigger recommendation fetch on component mount
  useEffect(() => {
    if (formData && responses) {
      fetchRecommendation();
    }
  }, [formData, responses]);

  if (loading) return <div className="text-center text-xl">Loading...</div>;

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-green-600 mb-6">Your Hair Care Recommendation</h1>

      {error && <div className="text-red-500 text-lg mb-4">{error}</div>}

      {recommendation ? (
        <div className="bg-white shadow-lg rounded-lg p-6 w-full sm:w-[600px]">
          <h2 className="text-xl font-semibold text-green-700 mb-4">Recommended Kit: {recommendation.kit}</h2>
          <ul className="list-disc pl-6 text-lg">
            {recommendation.products.map((product, index) => (
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
