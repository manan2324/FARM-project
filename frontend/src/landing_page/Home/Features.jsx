import React from "react";
import { useNavigate, useParams } from "react-router-dom";

// Soil Testing Icon - shows a beaker with soil layers
const SoilIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M10 2v2.5" />
    <path d="M14 2v2.5" />
    <path d="M8.5 15.5c.83.83 2.17.83 3 0 .83-.83 2.17-.83 3 0 .83.83 2.17.83 3 0" />
    <path d="M8.5 19c.83.83 2.17.83 3 0 .83-.83 2.17-.83 3 0 .83.83 2.17.83 3 0" />
    <path d="M8 3.5h8l3 4.5v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8l3-4.5z" />
    <path d="M7 8h10" />
  </svg>
);

// AI Chatbot Icon - modern AI assistant representation
const BotIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="7" width="20" height="15" rx="2" />
    <path d="M12 2v5" />
    <path d="M8 12v2" />
    <path d="M16 12v2" />
    <path d="M8 17h8" />
    <path d="M2 11h20" />
  </svg>
);

// Disease Detection Icon - leaf with magnifying glass
const BugIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 2c-1.35.14-2.64.6-3.69 1.34L8 6" />
    <path d="M16.8 12.8a6 6 0 0 0 .2-1.8c0-2.28-1.27-4.26-3.13-5.28" />
    <path d="M11 9c-1.66 0-3 1.34-3 3 0 .47.11.92.31 1.32" />
    <circle cx="14" cy="15" r="6" />
    <path d="m18 19 3 3" />
    <path d="M7 3C4.79 3.77 3 5.91 3 8.5c0 2.21 1.08 4.17 2.75 5.39" />
  </svg>
);

// Market Analysis Icon - trending chart with currency
const StoreIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
    <path d="M7 7h.01" />
    <path d="m16 11-5-5" />
    <path d="m16 11 4 4" />
    <path d="m12 15 4-4" />
  </svg>
);

const Features = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // for farm id from URL (e.g., /farm/:id/features)

  const advisoryFeatures = [
    { label: "Soil Advisory", Icon: SoilIcon, path: `/farm/${id}/soil-testing`, color: "text-green-600", bgColor: "bg-green-100" },
    { label: "AI Chatbot", Icon: BotIcon, path: "/chatbot", color: "text-blue-600", bgColor: "bg-blue-100" },
    { label: "Disease Detection", Icon: BugIcon, path: `/farm/${id}/disease-testing`, color: "text-red-600", bgColor: "bg-red-100" },
    { label: "Market Prices", Icon: StoreIcon, path: `/market`, color: "text-purple-600", bgColor: "bg-purple-100" },
  ];

  const FeatureCard = ({ feature, onClick }) => (
    <div onClick={() => onClick(feature.path)} className="bg-white rounded-2xl p-6 text-center flex flex-col items-center justify-center space-y-3 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5">
      <div className={`p-4 rounded-full ${feature.bgColor}`}><feature.Icon className={`w-8 h-8 ${feature.color}`} /></div>
      <p className="font-bold text-slate-700 leading-tight">{feature.label}</p>
    </div>
  );

  const handleClick = (path) => {
    navigate(path);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Tools & Features</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {advisoryFeatures.map((feature) => (
          <FeatureCard key={feature.label} feature={feature} onClick={handleClick} />
        ))}
      </div>
    </div>
  );
};

export default Features;
