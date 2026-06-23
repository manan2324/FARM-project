import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { makeAuthenticatedRequest } from "../../firebase/api";
import { soilCategories } from "../../data/soil";
import { cropTypes } from "../../data/crop";
import { stateData } from "../../data/statesinfo";

const ArrowLeftIcon = (props) => (
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
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);
const DeleteIcon = (props) => (
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
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);
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

// --- Reusable Form Components ---
const FormRow = ({ label, children }) => (
  <div>
    <label className="block text-sm font-bold text-slate-700 mb-1.5">
      {label}
    </label>
    {children}
  </div>
);
const StyledInput = (props) => (
  <input
    {...props}
    className="block w-full rounded-xl border-2 border-slate-300 py-3 px-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
  />
);
const StyledSelect = (props) => (
  <select {...props} className="block w-full rounded-xl border-2 border-slate-300 py-3 px-4 text-slate-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
);

const EditFarmPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    farmName: "",
    farmSize: "",
    soilType: "",
    village: "",
    district: "",
    state: "",
    plots: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    const fetchFarm = async () => {
      try {
        setLoading(true);
        setError(null);
        const farm = await makeAuthenticatedRequest(
          `http://localhost:5000/farms/${id}`
        );

        setFormData({
          farmName: farm.farmName,
          farmSize: farm.farmSize,
          soilType: farm.soilType,
          village: farm.village,
          district: farm.district,
          state: farm.state,
          plots: farm.plots || [],
        });
      } catch (error) {
        console.error("Error fetching farm:", error);
        setError("Failed to load farm data");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchFarm();
  }, [id, navigate]);

  useEffect(() => {
    const allStates = Object.keys(stateData).map((name) => ({ name }));
    setStates(allStates);
  }, []);

  useEffect(() => {
    if (formData?.state) {
      const selectedStateDistricts = stateData[formData.state] || [];
      setDistricts(selectedStateDistricts.map((name) => ({ name })));
    } else {
      setDistricts([]);
    }
  }, [formData?.state]);

  const validatePlotSizes = () => {
    const totalPlotSize = formData.plots.reduce(
      (sum, plot) => sum + parseFloat(plot.plotSize || 0),
      0
    );
    if (totalPlotSize > parseFloat(formData.farmSize)) {
      return `Total plot size (${totalPlotSize} acres) cannot exceed farm size (${formData.farmSize} acres)`;
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const plotSizeError = validatePlotSizes();
    if (plotSizeError) {
      setSubmitError(plotSizeError);
      return;
    }

    try {
      setSubmitLoading(true);
      setSubmitError(null);

      const farmData = {
        ...formData,
        farmSize: parseFloat(formData.farmSize),
        plots: formData.plots.map((plot) => ({
          plotName: plot.plotName,
          plotSize: parseFloat(plot.plotSize),
          cropType: plot.cropType,
        })),
      };

      await makeAuthenticatedRequest(`http://localhost:5000/farms/${id}`, {
        method: "PUT",
        body: JSON.stringify(farmData),
      });

      navigate("/");
    } catch (error) {
      console.error("Error updating farm:", error);
      setSubmitError("Failed to update farm. Please try again.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePlotChange = (index, field, value) => {
    setFormData((prev) => {
      const newPlots = prev.plots.map((plot, i) =>
        i === index ? { ...plot, [field]: value } : plot
      );

      // Check plot size limitations only when changing plot size
      if (field === "plotSize") {
        const totalPlotSize = newPlots.reduce(
          (sum, plot) => sum + parseFloat(plot.plotSize || 0),
          0
        );
        if (totalPlotSize > parseFloat(prev.farmSize)) {
          setSubmitError(
            `Warning: Total plot size (${totalPlotSize} acres) exceeds farm size (${prev.farmSize} acres)`
          );
        } else {
          setSubmitError(null);
        }
      }

      return {
        ...prev,
        plots: newPlots,
      };
    });
  };

  const handleAddPlot = () => {
    setFormData((prev) => ({
      ...prev,
      plots: [
        ...prev.plots,
        {
          id: prev.plots.length + 1,
          plotName: "",
          plotSize: "",
          cropType: "",
        },
      ],
    }));
  };

  const handleRemovePlot = (index) => {
    setFormData((prev) => ({
      ...prev,
      plots: prev.plots.filter((_, i) => i !== index),
    }));
  };

  const onBack = () => {
    window.history.back();
  };

  if (loading)
    return <div className="text-center p-12">Loading farm data...</div>;
  if (error)
    return <div className="text-center p-12 text-red-600">{error}</div>;

  return (
    <div className="bg-slate-100 font-sans min-h-screen p-4 py-8">
      <div className="w-full max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-slate-600 hover:text-slate-800 font-semibold"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span>Back to Farms</span>
        </button>
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <header className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              Edit Farm Details
            </h1>
            <p className="mt-2 text-slate-500">
              Update the information for your farm and its plots.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-10">
            <section>
              <h2 className="text-xl font-bold text-indigo-700 border-b-2 border-indigo-100 pb-2 mb-6">
                Farm Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                <FormRow label="Farm Name">
                  <StyledInput
                    type="text"
                    name="farmName"
                    value={formData.farmName}
                    onChange={handleChange}
                    required
                  />
                </FormRow>
                <FormRow label="Farm Size (acres)">
                  <StyledInput
                    type="number"
                    name="farmSize"
                    value={formData.farmSize}
                    onChange={handleChange}
                    required
                  />
                </FormRow>
                <FormRow label="Soil Type">
                  <StyledSelect
                    name="soilType"
                    value={formData.soilType}
                    onChange={handleChange}
                    required
                  >
                    {Object.entries(soilCategories).map(([cat, soils]) => (
                      <optgroup key={cat} label={cat}>
                        {soils.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </StyledSelect>
                </FormRow>
                <FormRow label="State">
                  <StyledSelect
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>
                      Select state
                    </option>
                    {states.map((s) => (
                      <option key={s.name} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </StyledSelect>
                </FormRow>
                <FormRow label="District">
                  <StyledSelect
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    required
                    disabled={!formData.state || districts.length === 0}
                  >
                    <option value="" disabled>
                      Select district
                    </option>
                    {districts.map((d) => (
                      <option key={d.name} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </StyledSelect>
                </FormRow>
                <FormRow label="Village / Town">
                  <StyledInput
                    type="text"
                    name="village"
                    value={formData.village}
                    onChange={handleChange}
                    required
                  />
                </FormRow>
                <FormRow label="PIN Code">
                  <StyledInput
                    type="text"
                    name="pinCode"
                    value={formData.pinCode}
                    onChange={handleChange}
                    required
                  />
                </FormRow>
              </div>
            </section>

            <section>
              <div className="flex flex-wrap justify-between items-center gap-4 border-b-2 border-indigo-100 pb-2 mb-6">
                <h2 className="text-xl font-bold text-indigo-700">
                  Crop Plots ({formData.plots.length})
                </h2>
                <button
                  type="button"
                  onClick={handleAddPlot}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                >
                  <AddIcon className="w-5 h-5" /> Add Plot
                </button>
              </div>
              <div className="space-y-4">
                {formData.plots.map((plot, index) => (
                  <div
                    key={index}
                    className="bg-slate-50 p-4 rounded-xl border-2 border-slate-200 relative group"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormRow label={`Plot ${index + 1} Name`}>
                        <StyledInput
                          type="text"
                          value={plot.plotName}
                          onChange={(e) =>
                            handlePlotChange(index, "plotName", e.target.value)
                          }
                          required
                        />
                      </FormRow>
                      <FormRow label="Plot Size (acres)">
                        <StyledInput
                          type="number"
                          value={plot.plotSize}
                          onChange={(e) =>
                            handlePlotChange(index, "plotSize", e.target.value)
                          }
                          required
                        />
                      </FormRow>
                      <FormRow label="Crop Type">
                        <StyledSelect
                          value={plot.cropType}
                          onChange={(e) =>
                            handlePlotChange(index, "cropType", e.target.value)
                          }
                          required
                        >
                          <option value="" disabled>
                            Select crop
                          </option>
                          {cropTypes.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </StyledSelect>
                      </FormRow>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemovePlot(index)}
                      className="absolute -top-2 -right-2 text-slate-400 bg-white border-2 border-slate-300 rounded-full p-1 opacity-0 group-hover:opacity-100 hover:text-red-600 hover:border-red-500 transition-all"
                    >
                      <DeleteIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {submitError && (
              <div className="p-3 bg-red-100 text-red-700 rounded-lg">
                {submitError}
              </div>
            )}

            <div className="pt-6 flex flex-col sm:flex-row justify-center gap-4">
              <button
                type="button"
                onClick={onBack}
                className="w-full sm:w-auto flex justify-center py-3.5 px-8 border-2 border-slate-300 rounded-xl shadow-sm text-base font-bold text-slate-700 bg-white hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitLoading}
                className="w-full sm:w-auto flex justify-center items-center py-3.5 px-8 border-transparent rounded-xl shadow-sm text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
              >
                {submitLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditFarmPage;
