import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const LeafIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M11 20A7 7 0 0 1 4 13V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v3.5a3.5 3.5 0 0 1-3.5 3.5H2" /><path d="M12 9.5A3.5 3.5 0 0 0 8.5 6H6v3.5a3.5 3.5 0 0 0 3.5 3.5h.5a3.5 3.5 0 0 0 3.5-3.5V6a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a7 7 0 0 1-7 7h-1z" /></svg>;
const AlertTriangleIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>;
const ArrowLeftIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>;

const apiUrl = "http://127.0.0.1:8000"; //Crop recommend ML model API

const SoilDataCard = ({ data }) => (
  <div className="bg-slate-50 rounded-xl p-6">
    <h3 className="font-bold text-slate-700 mb-4">Soil Analysis Results</h3>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {Object.entries(data).map(([key, value]) => (
        <div key={key} className="bg-white rounded-lg p-3 shadow-sm">
          <span className="block text-xs font-semibold text-slate-500 mb-1">{key.toUpperCase()}</span>
          <span className="block text-lg font-bold text-slate-800">{value}</span>
        </div>
      ))}
    </div>
    <div className="mt-4 text-sm text-slate-600">
      <p>🌱 These values determine which crops are most likely to thrive in your soil.</p>
    </div>
  </div>
);

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center text-center p-8">
    <svg className="animate-spin h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <p className="mt-4 font-semibold text-slate-600">Analyzing your soil data...</p>
  </div>
);

const CropPage = () => {
  const location = useLocation();
  const farmId = location.state?.farmId;
  const soilData = location.state?.data;
  const navigate = useNavigate();

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onBack = (e) => {
    e.preventDefault();
    navigate(`/farm/${farmId}/soil-testing`);
  }

  useEffect(() => {
    if (!soilData) return;

    const fetchPrediction = async () => {
      setLoading(true);
      setError(null);
      setPrediction(null);

      try {
        const res = await axios.post(`${apiUrl}/predict`, {
          N: Number(soilData.N),
          P: Number(soilData.P),
          K: Number(soilData.K),
          temperature: Number(soilData.temperature),
          humidity: Number(soilData.humidity),
          ph: Number(soilData.ph),
        });

        setPrediction(res.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPrediction();
  }, [soilData]); //data

  console.log(prediction);

  return (
    <div className="bg-slate-100 font-sans flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8 space-y-6 relative">
        <button onClick={onBack} className="absolute top-4 left-4 text-slate-500 hover:text-slate-800 cursor-pointer">
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <header className="text-center">
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Crop Recommendation</h1>
        </header>

        <div className="min-h-[200px] flex items-center justify-center">
          {loading && <LoadingSpinner />}
          {error && (
            <div className="text-center text-red-600">
              <AlertTriangleIcon className="w-12 h-12 mx-auto" />
              <h2 className="mt-2 font-bold text-lg">Analysis Failed</h2>
              <p className="text-sm">{error}</p>
            </div>
          )}
          {!loading && !error && prediction && (
            <div className="w-full">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-green-100 rounded-full mx-auto flex items-center justify-center">
                  <LeafIcon className="w-12 h-12 text-green-600" />
                </div>
                <p className="mt-4 font-semibold text-slate-600">Recommended Crops</p>
                <p className="text-sm text-slate-500">Based on soil conditions and success rate</p>
              </div>
              
              <div className="grid gap-4">
                {Object.entries(prediction.predicted_crops)
                  .sort(([, a], [, b]) => b - a)
                  .map(([crop, probability]) => (
                    <div 
                      key={crop}
                      className="bg-white border-2 border-slate-100 rounded-xl p-4 transition-all hover:border-green-200 hover:shadow-md"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-slate-800 capitalize">
                            {crop}
                          </h3>
                          <p className="text-sm text-slate-500">
                            Success Rate
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">
                            {Math.round(probability * 100)}%
                          </div>
                          <div className="w-32 h-2 bg-slate-100 rounded-full mt-2">
                            <div 
                              className="h-full bg-green-500 rounded-full transition-all duration-500"
                              style={{ width: `${probability * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-slate-500">
                  💡 Crops are ranked by their predicted success rate based on your soil conditions
                </p>
              </div>
            </div>
          )}
        </div>

        {soilData && <SoilDataCard data={soilData} />}
      </div>
    </div>
  );
};

export default CropPage;
