import React, { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../../firebase/AuthContext";
import { makeAuthenticatedRequest } from "../../firebase/api";

const AddIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);
const EditIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
  </svg>
);

const ChevronRightIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);
const TrashIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);
const AgricultureIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M14.5 13c-1.2 0-2.5.6-3.5 1.5-1-.9-2.3-1.5-3.5-1.5-2.2 0-4 2.2-4 5V22h15v-3.5c0-2.8-1.8-5-4-5z"></path>
    <path d="M5 13.5V6a2 2 0 0 1 2-2h2.5a2 2 0 0 1 2 2v2.5"></path>
    <path d="M19 13.5V6a2 2 0 0 0-2-2h-2.5a2 2 0 0 0-2 2v2.5"></path>
    <path d="M9 13.5h6"></path>
  </svg>
);

const FarmHomePage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [farmToDelete, setFarmToDelete] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      <Navigate to="/language" replace/>;
      return;
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    const fetchFarms = async () => {
      try {
        setLoading(true);
        const response = await makeAuthenticatedRequest('http://localhost:5000/farms');
        setFarms(response);
        setError(null);
      } catch (error) {
        console.error('Error fetching farms:', error);
        setError('No farms found or unable to fetch farms');
      } finally {
        setLoading(false);
      }
    };

    fetchFarms();
  }, []);

  const handleAddFarm = () => {
    navigate("/add-farm");
  };

  const handleFarmClick = (farmId) => {
    navigate(`/farm/${farmId}`);
  };

  const handleEditFarm = (e, farmId) => {
    e.stopPropagation();
    navigate(`/farm/${farmId}/edit`);
  };

  const handleDeleteClick = (e, farm) => {
    e.stopPropagation();
    setFarmToDelete(farm);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await makeAuthenticatedRequest(`http://localhost:5000/farms/${farmToDelete._id}`, {
        method: 'DELETE'
      });
      setFarms(farms.filter(farm => farm._id !== farmToDelete._id));
      setShowDeleteConfirm(false);
      setFarmToDelete(null);
    } catch (error) {
      console.error('Error deleting farm:', error);
      setError('Failed to delete farm. Please try again.');
    }
  };

  const getCropDisplayText = (plots) => {
    if (!plots || plots.length === 0) return "No crops";
    const cropNames = plots.map((p) => p.cropType);
    if (cropNames.length <= 2) return cropNames.join(", ");
    return `${cropNames[0]}, ${cropNames[1]} +${cropNames.length - 2} more`;
  };

  const FarmCard = ({ farm }) => (
    <div
      onClick={() => handleFarmClick(farm._id)}
      className="bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5"
    >
      <div>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-100 p-3 rounded-full">
              <AgricultureIcon className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">
                {farm.farmName}
              </h3>
              <p className="text-sm text-slate-500">{`${farm.village}, ${farm.district}`}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => handleEditFarm(e, farm._id)}
              className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
              title="Edit Farm"
            >
              <EditIcon className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => handleDeleteClick(e, farm)}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
              title="Delete Farm"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
            <ChevronRightIcon className="w-6 h-6 text-slate-400" />
          </div>
        </div>
        <div className="border-t my-4"></div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-slate-500">Farm Size</p>
            <p className="font-bold text-slate-700">{farm.farmSize} acres</p>
          </div>
          <div>
            <p className="text-slate-500">Soil Type</p>
            <p className="font-bold text-slate-700 truncate">{farm.soilType}</p>
          </div>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t flex justify-between items-center">
        <p className="text-sm text-slate-500">
          Crops:{" "}
          <span className="font-bold text-slate-700">
            {getCropDisplayText(farm.plots)}
          </span>
        </p>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-100 text-indigo-800">
          {farm.plots.length} plot{farm.plots.length > 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );

  const EmptyState = () => (
    <div className="text-center py-16 px-6 bg-white rounded-2xl shadow-lg">
      <AgricultureIcon className="mx-auto w-16 h-16 text-slate-300" />
      <h3 className="mt-4 text-xl font-bold text-slate-800">
        No farms added yet
      </h3>
      <p className="mt-2 text-slate-500">
        Start by adding your first farm to track your activities.
      </p>
      <button
        onClick={handleAddFarm}
        className="mt-6 inline-flex items-center gap-2 px-6 py-3 text-base font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-transform hover:-translate-y-1"
      >
        <AddIcon className="w-5 h-5" />
        Add Your First Farm
      </button>
    </div>
  );

  return (
    <div className="bg-slate-100 font-sans min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">
            My Farms
          </h1>
          <button
            onClick={handleAddFarm}
            className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-transform hover:-translate-y-0.5"
          >
            <AddIcon className="w-5 h-5" />
            Add Farm
          </button>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="mt-2 text-slate-600">Loading farms...</p>
          </div>
        ) : farms.length > 0 ? (
          <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {farms.map((farm) => (
              <FarmCard key={farm.id} farm={farm} />
            ))}
          </main>
        ) : (
          <EmptyState />
        )}

        {/* Floating Action Button for Mobile */}
        <button
          onClick={handleAddFarm}
          className="md:hidden fixed bottom-6 right-6 flex items-center justify-center w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-transform hover:scale-110"
          aria-label="Add Farm"
        >
          <AddIcon className="w-7 h-7" />
        </button>

        {/* Delete Confirmation Dialog */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
              <h3 className="text-xl font-bold text-slate-800 mb-4">Delete Farm</h3>
              <p className="text-slate-600 mb-6">
                Are you sure you want to delete "{farmToDelete?.farmName}"? This action cannot be undone.
              </p>
              <div className="flex gap-4 justify-end">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setFarmToDelete(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                  Delete Farm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmHomePage;
