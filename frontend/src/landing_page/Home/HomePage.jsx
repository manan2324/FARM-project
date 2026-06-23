import React, { useEffect, useState } from "react";
import Weather from "./Weather";
import Features from "./Features";
import FarmDetails from "./FarmDetails";
import { useParams } from "react-router-dom";
import { makeAuthenticatedRequest } from "../../firebase/api";

const HomePage = () => {
  let params = useParams();
  let { id } = params;
  const [farmData, setFarmData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getFarm = async () => {
      try {
        setLoading(true);
        const farm = await makeAuthenticatedRequest(`http://localhost:5000/farms/${id}`);
        setFarmData(farm);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch farm data');
        console.error('Error fetching farm data:', err);
      } finally {
        setLoading(false);
      }
    }
    if (id) {
      getFarm();
    }
  }, [id])

  return (
    <div className="bg-slate-100 font-sans min-h-screen">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="text-lg text-gray-600">Loading...</div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error! </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        ) : (
          <div className="space-y-8">
            {farmData && (
              <FarmDetails farmData={farmData} />
            )}
            {farmData && (
              <Weather 
                location={{
                  village: farmData.village || '',
                  district: farmData.district || '',
                  state: farmData.state || ''
                }}
                farmId={id} 
              />
            )}
            <Features />
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
