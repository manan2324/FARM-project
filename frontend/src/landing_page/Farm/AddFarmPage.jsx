import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { soilCategories } from '../../data/soil';
import { cropTypes } from '../../data/crop';
import { stateData } from '../../data/statesinfo';
import { makeAuthenticatedRequest } from '../../firebase/api';

const AddIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);
const DeleteIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
);

const FormRow = ({ label, children }) => (
  <div>
    <label className="block text-sm font-bold text-slate-700 mb-1">{label}</label>
    {children}
  </div>
);
const StyledInput = (props) => (
  <input {...props} className="block w-full rounded-xl border-2 border-slate-300 py-3 px-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
);
const StyledSelect = (props) => (
  <select {...props} className="block w-full rounded-xl border-2 border-slate-300 py-3 px-4 text-slate-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
);

const AddFarmPage = () => {
  const navigate = useNavigate();
  const initialFormState = {
    farmName: '',
    farmSize: '',
    soilType: '',
    state: '',
    district: '',
    village: '',
    pinCode: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  const [plots, setPlots] = useState([
    {
      id: 1,
      plotName: '',
      plotSize: '',
      cropType: '',
    }
  ]);

  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState({ states: false, districts: false });

  // Initialize states from local data
  useEffect(() => {
    setLoading(prev => ({ ...prev, states: true }));

    // Convert stateData keys to state format
    const statesList = Object.keys(stateData).map(stateName => ({
      name: stateName,
      iso2: stateName.toLowerCase().replace(/\s+/g, '_') // Create a simple identifier
    }));

    setStates(statesList);
    setLoading(prev => ({ ...prev, states: false }));
  }, []);

  // Update districts when state changes
  useEffect(() => {
    if (formData.state) {
      setLoading(prev => ({ ...prev, districts: true }));

      // Get districts from local data
      const selectedStateDistricts = stateData[formData.state] || [];
      const districtsList = selectedStateDistricts.map(district => ({
        name: district
      }));

      setDistricts(districtsList);
      setFormData(prev => ({ ...prev, district: '' }));
      setLoading(prev => ({ ...prev, districts: false }));
    } else {
      setDistricts([]);
    }
  }, [formData.state]);

  const handleInputChange = (field) => (event) => {
    let value = event.target.value;

    if (field === 'pinCode') {
      // Only allow digits, max 6
      value = value.replace(/\D/g, "").slice(0, 6);
    }

    if (field === 'farmSize') {
      // Prevent negative and keep it numeric
      value = value.replace(/[^0-9.]/g, "");
    }

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePlotChange = (plotId, field, value) => {
    if (field === 'plotSize') {
      value = value.replace(/[^0-9.]/g, ""); // only digits + dot
    }

    setPlots((prev) =>
      prev.map((plot) =>
        plot.id === plotId ? { ...plot, [field]: value } : plot
      )
    );
  };

  const addPlot = () => {
    const newPlot = {
      id: Date.now(),
      plotName: '',
      plotSize: '',
      cropType: '',
    };
    setPlots(prev => [...prev, newPlot]);
  };

  const removePlot = (plotId) => {
    if (plots.length > 1) {
      setPlots(prev => prev.filter(plot => plot.id !== plotId));
    }
  };

  const getTotalPlotSize = () => {
    return plots.reduce((total, plot) => total + (parseFloat(plot.plotSize) || 0), 0);
  };

  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const validateForm = () => {
    if (!formData.farmName.trim()) return "Farm name is required";
    if (!formData.farmSize || parseFloat(formData.farmSize) <= 0) return "Valid farm size is required";
    if (!formData.soilType) return "Soil type is required";
    if (!formData.state) return "State is required";
    if (!formData.district) return "District is required";
    if (!formData.village.trim()) return "Village/Town is required";
    if (!/^\d{6}$/.test(formData.pinCode)) return "Valid 6-digit PIN code is required";

    const totalPlotSize = getTotalPlotSize();
    const farmSize = parseFloat(formData.farmSize);
    if (totalPlotSize > farmSize) {
      return `Total plot size (${totalPlotSize} acres) cannot exceed farm size (${farmSize} acres)`;
    }

    for (const plot of plots) {
      if (!plot.plotName.trim()) return `Plot name is required for all plots`;
      if (!plot.plotSize || parseFloat(plot.plotSize) <= 0) return `Valid plot size is required for all plots`;
      if (!plot.cropType) return `Crop type is required for all plots`;
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setSubmitError(validationError);
      return;
    }

    try {
      setSubmitLoading(true);
      setSubmitError(null);

      const farmData = {
        ...formData,
        farmSize: parseFloat(formData.farmSize),
        plots: plots.map(plot => ({
          plotName: plot.plotName.trim(),
          plotSize: parseFloat(plot.plotSize),
          cropType: plot.cropType
        }))
      };

      await makeAuthenticatedRequest('http://localhost:5000/farms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(farmData)
      });

      navigate('/');
    } catch (error) {
      console.error('Error creating farm:', error);
      setSubmitError('Failed to create farm. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="bg-slate-100 font-sans min-h-screen p-4 py-8">
      <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Add Farm Details</h1>
          <p className="mt-2 text-slate-500">Provide information about your farm and its plots.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Farm Information Section */}
          <section>
            <h2 className="text-xl font-bold text-indigo-700 border-b-2 border-indigo-200 pb-2 mb-6">Farm Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormRow label="Farm Name">
                <StyledInput
                  type="text"
                  name="farmName"
                  id="farmName"
                  onChange={handleInputChange('farmName')}
                  value={formData.farmName}
                  required
                  placeholder="e.g., Green Valley Farm"
                />
              </FormRow>
              <FormRow label="Farm Size (acres)">
                <StyledInput
                  type="number"
                  name="farmSize"
                  min="0"
                  step="0.01"
                  value={formData.farmSize}
                  onChange={handleInputChange('farmSize')}
                  required
                  placeholder="e.g., 12.5"
                />
              </FormRow>
              <FormRow label="Soil Type">
                <StyledSelect value={formData.soilType} onChange={handleInputChange('soilType')} required>
                  <option value="" disabled>Select soil type</option>
                  {Object.entries(soilCategories).map(([category, soils]) => (<optgroup key={category} label={category}>{soils.map(s => <option key={s} value={s}>{s}</option>)}</optgroup>))}
                </StyledSelect>
              </FormRow>
              <FormRow label="State">
                <StyledSelect
                  value={formData.state}
                  onChange={handleInputChange('state')}
                  required
                >
                  <option value="" disabled>Select state</option>
                  {states.map(s => (
                    <option key={s.iso2} value={s.name}>{s.name}</option>
                  ))}
                </StyledSelect>
              </FormRow>
              <FormRow label="District">
                <StyledSelect
                  value={formData.district}
                  onChange={handleInputChange('district')}
                  required
                  disabled={!formData.state}
                >
                  <option value="" disabled>Select district</option>
                  {districts.map(d => (
                    <option key={d.name} value={d.name}>{d.name}</option>
                  ))}
                </StyledSelect>
              </FormRow>
              <FormRow label="Village / Town"><StyledInput value={formData.village} onChange={handleInputChange('village')} required /></FormRow>
              <FormRow label="PIN Code">
                <StyledInput
                  type="text"
                  value={formData.pinCode}
                  onChange={handleInputChange('pinCode')}
                  required
                />
              </FormRow>
            </div>
          </section>

          {/* Plots Section */}
          <section>
            <div className="flex flex-wrap justify-between items-center gap-4 border-b-2 border-indigo-200 pb-2 mb-6">
              <h2 className="text-xl font-bold text-indigo-700">Crop Plots ({plots.length})</h2>
              <div className="flex items-center gap-4">
                {formData.farmSize && <span className={`text-sm font-bold px-3 py-1 rounded-full ${getTotalPlotSize() > parseFloat(formData.farmSize) ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>Total: {getTotalPlotSize()} / {formData.farmSize} acres</span>}
                <button type="button" onClick={addPlot} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-transform hover:-translate-y-0.5"><AddIcon className="w-5 h-5" /> Add Plot</button>
              </div>
            </div>

            <div className="space-y-4">
              {plots.map((plot, index) => (
                <div key={plot.id} className="bg-slate-50 p-4 rounded-xl border-2 border-slate-200 relative">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormRow label={`Plot ${index + 1} Name`}><StyledInput value={plot.plotName} onChange={(e) => handlePlotChange(plot.id, 'plotName', e.target.value)} required placeholder="e.g., North Field" /></FormRow>
                    <FormRow label="Plot Size (acres)"><StyledInput type="number" value={plot.plotSize} onChange={(e) => handlePlotChange(plot.id, 'plotSize', e.target.value)} required placeholder="e.g., 5.0" /></FormRow>
                    <FormRow label="Crop Type">
                      <StyledSelect value={plot.cropType} onChange={(e) => handlePlotChange(plot.id, 'cropType', e.target.value)} required>
                        <option value="" disabled>Select crop</option>
                        {cropTypes.map(c => <option key={c} value={c}>{c}</option>)}
                      </StyledSelect>
                    </FormRow>
                  </div>
                  {plots.length > 1 && <button type="button" onClick={() => removePlot(plot.id)} className="absolute top-3 right-3 text-red-500 hover:text-red-700"><DeleteIcon className="w-5 h-5" /></button>}
                </div>
              ))}
            </div>
          </section>

          {/* Error Message */}
          {submitError && (
            <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {submitError}
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-6 flex justify-center">
            <button
              type="submit"
              disabled={submitLoading}
              className="w-full max-w-xs flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-base font-bold text-white bg-indigo-800 hover:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitLoading ? 'Creating Farm...' : 'Submit Farm Details'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFarmPage;