import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { makeAuthenticatedRequest } from '../../firebase/api';

// --- SVG Icon Components ---
const UploadCloudIcon = (props) => (
  <svg
    xmlns="http://www.w.w3.org/2000/svg"
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
    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
    <path d="M12 12v9" />
    <path d="m16 16-4-4-4 4" />
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
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
const ArrowLeftIcon = (props) => (
  <svg
    xmlns="http://www.w.w3.org/2000/svg"
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
const LeafIcon = (props) => (
  <svg
    xmlns="http://www.w.w3.org/2000/svg"
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
    <path d="M11 20A7 7 0 0 1 4 13V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v3.5a3.5 3.5 0 0 1-3.5 3.5H2" />
    <path d="M12 9.5A3.5 3.5 0 0 0 8.5 6H6v3.5a3.5 3.5 0 0 0 3.5 3.5h.5a3.5 3.5 0 0 0 3.5-3.5V6a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a7 7 0 0 1-7 7h-1z" />
  </svg>
);
const BeakerIcon = (props) => (
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
    <path d="M4.5 3h15" />
    <path d="M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3" />
    <path d="M6 14h12" />
  </svg>
);

// --- Reusable Form Components ---
const StyledInput = (props) => (
  <input
    {...props}
    className="block w-full rounded-xl border-2 border-slate-300 py-3 px-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
  />
);
const StyledSelect = (props) => (
  <select
    {...props}
    className="block w-full rounded-xl border-2 border-slate-300 py-3 px-4 text-slate-900 
             focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm 
             appearance-none bg-no-repeat pr-10 
             bg-[url('data:image/svg+xml,%3csvg%20xmlns%3d%22http%3a//www.w3.org/2000/svg%22%20fill%3d%22none%22%20viewBox%3d%220%200%2020%2020%22%3e%3cpath%20stroke%3d%22%236b7280%22%20stroke-linecap%3d%22round%22%20stroke-linejoin%3d%22round%22%20stroke-width%3d%221.5%22%20d%3d%22m6%208%204%204%204-4%22/%3e%3c/svg%3e')] 
             bg-[length:1rem_1rem] bg-[position:right_1rem_center]"
  />
);
const PrimaryButton = ({ children, ...props }) => (
  <button
    {...props}
    className="w-full justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform hover:-translate-y-1 disabled:bg-slate-300 disabled:cursor-not-allowed"
  >
    {children}
  </button>
);
const SecondaryButton = ({ children, ...props }) => (
  <button
    {...props}
    className="w-full justify-center py-3.5 px-4 border-2 border-slate-300 rounded-xl shadow-sm text-base font-bold text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 transition-transform hover:-translate-y-1"
  >
    {children}
  </button>
);

export default function SoilTestPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    N: "",
    P: "",
    K: "",
    ph: "",
    humidity: "",
    temperature: "",
  });
  const [pdfFile, setPdfFile] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [farm, setFarm] = useState(null);

  useEffect(() => {
    if (step === 3) {
      const allFieldsFilled = Object.values(formData).every(val => val.trim() !== '');
      setIsFormValid(allFieldsFilled);
    }
  }, [formData, step]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchFarm = async () => {
      try {
        const res = await makeAuthenticatedRequest(`http://localhost:5000/farms/${id}`);
        if (!res) throw new Error("Failed to fetch farm");
        setFarm(res);
        // console.log(res);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchFarm();
  }, [id]);

  useEffect(() => {
    if (farm?.weather) {
      setFormData(prev => ({
        ...prev,
        temperature: farm.weather.temperature?.toString() || "",
        humidity: farm.weather.humidity?.toString() || ""
      }))
    }
  }, [farm]);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const goToRecommendation = (type) => {
    const dataToSend = pdfFile ? { pdfName: pdfFile.name } : formData;
    if (type === "crop") {
      navigate(`/farm/${id}/soil-testing/crop`, {
        state: { data: dataToSend, farmId: id },
      });
    } else if (type === "fertilizer") {
      navigate(`/farm/${id}/soil-testing/fertilizer`, {
        state: { data: dataToSend, crop: selectedCrop, farmId: id },
      });
    }
  };

  const renderStep = () => {
    switch (step) {
      // Step 1: Choose method
      case 1:
        return (
          <>
            <h2 className="text-xl font-bold text-slate-700 mb-2">
              How do you want to provide soil data?
            </h2>
            <div className="grid sm:grid-cols-2 gap-4 mt-6">
              <div
                onClick={() => setStep(2)}
                className="cursor-pointer text-center p-6 bg-slate-50 rounded-2xl border-2 border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-200"
              >
                <UploadCloudIcon className="w-12 h-12 mx-auto text-indigo-600" />
                <p className="mt-2 font-bold text-slate-800">
                  Upload Soil Test PDF
                </p>
              </div>
              <div
                onClick={() => setStep(3)}
                className="cursor-pointer text-center p-6 bg-slate-50 rounded-2xl border-2 border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-200"
              >
                <EditIcon className="w-12 h-12 mx-auto text-indigo-600" />
                <p className="mt-2 font-bold text-slate-800">
                  Enter Data Manually
                </p>
              </div>
            </div>
          </>
        );
      // Step 2: PDF Upload
      case 2:
        return (
          <>
            <h2 className="text-xl font-bold text-slate-700 mb-4">
              Upload Soil Test PDF
            </h2>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setPdfFile(e.target.files[0])}
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
            {pdfFile && (
              <p className="text-sm text-slate-600 mt-2">
                Selected: {pdfFile.name}
              </p>
            )}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <SecondaryButton onClick={() => setStep(1)}>
                <ArrowLeftIcon className="inline-block w-5 h-5 mr-2" />
                Back
              </SecondaryButton>
              <PrimaryButton disabled={!pdfFile} onClick={() => setStep(4)}>
                Continue
              </PrimaryButton>
            </div>
          </>
        );
      // Step 3: Manual Form
      case 3:
        const inputProps = {
          N: { min: 0, max: 500, step: 1, placeholder: "e.g., 90", label: "N (1-500)" },
          P: { min: 0, max: 200, step: 1, placeholder: "e.g., 45", label: "P (1-200)" },
          K: { min: 0, max: 300, step: 1, placeholder: "e.g., 45", label: "K (1-300)" },
          ph: { min: 0, max: 14, step: 0.1, placeholder: "e.g., 6.5", label: "pH (0-14)" },
          humidity: { min: 0, max: 100, step: 0.1, placeholder: "e.g., 65.5", label: "Humidity (%)" },
          temperature: { min: -20, max: 50, step: 0.1, placeholder: "e.g., 25.5", label: "Temperature (°C)" },
        };

        return (
          <>
            <h2 className="text-xl font-bold text-slate-700 mb-4">Enter Soil Data Manually</h2>
            <div className="grid grid-cols-2 gap-4">
              {Object.keys(formData).map((field) => (
                <div key={field}>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    {inputProps[field]?.label || field.toUpperCase()}
                  </label>
                  <StyledInput
                    name={field}
                    value={formData[field]}
                    onChange={handleFormChange}
                    type="number"
                    {...inputProps[field]}
                  />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <SecondaryButton onClick={() => setStep(1)}><ArrowLeftIcon className="inline-block w-5 h-5 mr-2" />Back</SecondaryButton>
              <PrimaryButton onClick={() => setStep(4)} disabled={!isFormValid}>Continue</PrimaryButton>
            </div>
          </>
        );
      // Step 4: Recommendation Options
      case 4:
        return (
          <>
            <h2 className="text-xl font-bold text-slate-700 mb-4">
              What do you want to see?
            </h2>
            <div className="flex flex-col gap-4">
              <div
                onClick={() => goToRecommendation("crop")}
                className="cursor-pointer flex items-center p-4 bg-slate-50 rounded-2xl border-2 border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-200"
              >
                <LeafIcon className="w-8 h-8 mr-4 text-green-600" />
                <p className="font-bold text-slate-800">Crop Recommendation</p>
              </div>
              <div
                onClick={() => setStep(5)}
                className="cursor-pointer flex items-center p-4 bg-slate-50 rounded-2xl border-2 border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-200"
              >
                <BeakerIcon className="w-8 h-8 mr-4 text-purple-600" />
                <p className="font-bold text-slate-800">
                  Fertilizer Recommendation
                </p>
              </div>
            </div>
            <div className="mt-6">
              <SecondaryButton onClick={() => setStep(pdfFile ? 2 : 3)}>
                <ArrowLeftIcon className="inline-block w-5 h-5 mr-2" />
                Back
              </SecondaryButton>
            </div>
          </>
        );
      // Step 5: Crop Selection for Fertilizer
      case 5:
        return (
          <>
            <h2 className="text-xl font-bold text-slate-700 mb-4">
              Select the crop you are planning to grow:
            </h2>
            <StyledSelect
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
            >
              <option value="" disabled>
                Select a crop
              </option>
              {farm?.plots?.map((plot) => (
                <option key={plot._id} value={plot.cropType}>
                  {plot.cropType} - {plot.plotName}
                </option>
              ))}
            </StyledSelect>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <SecondaryButton onClick={() => setStep(4)}>
                <ArrowLeftIcon className="inline-block w-5 h-5 mr-2" />
                Back
              </SecondaryButton>
              <PrimaryButton
                disabled={!selectedCrop}
                onClick={() => goToRecommendation("fertilizer")}
              >
                Get Recommendation
              </PrimaryButton>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-slate-100 font-sans flex items-center justify-center min-h-[80vh] p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8">
        <header className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            Soil Advisory
          </h1>
          <p className="mt-1 text-slate-500">for Farm {farm?.farmName}</p>
        </header>
        <div>{renderStep()}</div>
      </div>
    </div>
  );
}
