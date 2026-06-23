import { useLocation, useNavigate } from "react-router-dom"

const BeakerIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M4.5 3h15" /><path d="M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3" /><path d="M6 14h12" /></svg>;
const ScaleIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 16.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" /><path d="M6.25 6.25a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" /><path d="m22 2-5 5" /><path d="m11 13-5 5" /><path d="m2 22 10-10" /></svg>;
const CalendarIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;
const ArrowLeftIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>;
const CheckCircleIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;

const getFertilizerRecommendations = (soilData, crop) => {
  const { N = 0, P = 0, K = 0, pH = 7 } = soilData || {};
  const recommendations = [];

  if (!crop) return recommendations;

  // Crop-specific logic
  if (crop.toLowerCase() === "wheat") {
    if (N < 50)
      recommendations.push({
        fertilizer: "Urea (46% N)",
        amount: "50 kg/acre",
        schedule: "Apply every 20 days for 60 days (3 total).",
        icon: BeakerIcon,
        color: "blue",
      });
    if (P < 30)
      recommendations.push({
        fertilizer: "DAP (18-46-0)",
        amount: "40 kg/acre",
        schedule: "Apply once at sowing.",
        icon: BeakerIcon,
        color: "blue",
      });
    if (K < 30)
      recommendations.push({
        fertilizer: "Muriate of Potash (MOP)",
        amount: "25 kg/acre",
        schedule: "Apply once during tillering.",
        icon: BeakerIcon,
        color: "blue",
      });
  }

  if (crop.toLowerCase() === "rice") {
    if (N < 50)
      recommendations.push({
        fertilizer: "Urea (46% N)",
        amount: "60 kg/acre",
        schedule:
          "Split into 3 doses: at transplanting, tillering, and panicle initiation.",
        icon: BeakerIcon,
        color: "blue",
      });
    if (K < 30)
      recommendations.push({
        fertilizer: "MOP",
        amount: "30 kg/acre",
        schedule: "Apply once at panicle initiation stage.",
        icon: BeakerIcon,
        color: "blue",
      });
  }

  if (crop.toLowerCase() === "maize") {
    if (N < 50)
      recommendations.push({
        fertilizer: "Urea (46% N)",
        amount: "100 kg/acre",
        schedule: "50 kg at sowing + 50 kg at knee height stage.",
        icon: BeakerIcon,
        color: "blue",
      });
    if (P < 30)
      recommendations.push({
        fertilizer: "DAP (18-46-0)",
        amount: "30 kg/acre",
        schedule: "Apply once at sowing.",
        icon: BeakerIcon,
        color: "blue",
      });
  }

  // General pH correction
  if (pH < 6) {
    recommendations.push({
      fertilizer: "Agricultural Lime",
      amount: "500 kg/acre",
      schedule: "Apply once before sowing (lasts full season)",
      icon: BeakerIcon,
      color: "green"
    });
  } else if (pH > 8) {
    recommendations.push({
      fertilizer: "Gypsum",
      amount: "500 kg/acre",
      schedule: "Apply once before sowing (lasts full season)",
      icon: BeakerIcon,
      color: "green"
    });
  }

  return recommendations;
};

const RecommendationCard = ({ rec }) => {
  const colorVariants = {
    blue: { icon: "text-blue-600", bg: "bg-blue-50" },
    green: { icon: "text-green-600", bg: "bg-green-50" },
  };
  const colors = colorVariants[rec.color] || colorVariants.blue;

  return (
    <div className="bg-white rounded-2xl p-4 border-2 border-slate-200 flex space-x-4">
      <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${colors.bg}`}>
        <rec.icon className={`w-6 h-6 ${colors.icon}`} />
      </div>
      <div>
        <p className="font-bold text-slate-800">{rec.fertilizer}</p>
        <div className="text-sm text-slate-500 mt-1 flex flex-wrap gap-x-4 gap-y-1">
          <span className="flex items-center"><ScaleIcon className="w-4 h-4 mr-1.5" />{rec.amount}</span>
          <span className="flex items-center"><CalendarIcon className="w-4 h-4 mr-1.5" />{rec.schedule}</span>
        </div>
      </div>
    </div>
  );
};

const FertilizerPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data, crop, farmId } = location.state || {};
  if (!farmId) {
    navigate('/');
    return null;
  }
  const recommendations = getFertilizerRecommendations(data, crop || "Wheat");

  const onBack = (e) => {
    e.preventDefault();
    navigate(`/farm/${farmId}/soil-testing`);
  }

  return (
    <div className="bg-slate-100 font-sans flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8 relative">
        <button onClick={onBack} className="absolute top-4 left-4 text-slate-500 hover:text-slate-800 cursor-pointer">
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <header className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Fertilizer Plan</h1>
          <p className="mt-1 text-slate-500">
            For <span className="font-bold text-indigo-600">{crop}</span> based on your soil data.
          </p>
        </header>

        <div className="space-y-4">
          {recommendations.length > 0 ? (
            recommendations.map((rec, index) => (
              <RecommendationCard key={index} rec={rec} />
            ))
          ) : (
            <div className="text-center py-8 px-4 bg-green-50 rounded-2xl">
              <CheckCircleIcon className="w-12 h-12 text-green-600 mx-auto" />
              <h2 className="mt-4 font-bold text-lg text-green-800">Nutrients are Balanced</h2>
              <p className="text-green-700 mt-1">
                Your soil has sufficient nutrients for growing {crop}. No extra fertilizer is needed at this time.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FertilizerPage;