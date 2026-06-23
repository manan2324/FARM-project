import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// The main LanguagePage component.
// It's designed to be fully responsive, adjusting its layout
// for different screen sizes from mobile to desktop.
const LanguagePage = () => {
  // --- STATE ---
  // Holds the code of the currently selected language, e.g., 'en', 'hi'.
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const navigate = useNavigate();

  // --- DATA ---
  // Array of available languages.
  const languages = [
    { code: 'en', name: 'English', native: 'English', icon: 'E' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी', icon: 'हि' },
    { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી', icon: 'ગુ' },
    { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', icon: 'ਪੰ' },
    { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', icon: 'ಕ' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்', icon: 'த' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు', icon: 'తె' },
    { code: 'bn', name: 'Bengali', native: 'বাংলা', icon: 'ব' },
    { code: 'mr', name: 'Marathi', native: 'मराठी', icon: 'म' },
    { code: 'ur', name: 'Urdu', native: 'اردو', icon: 'ا' },
    { code: 'ml', name: 'Malayalam', native: 'മലയാളം', icon: 'മ' },
    { code: 'as', name: 'Assamese', native: 'অসমীয়া', icon: 'অ' },
  ];

  // --- EVENT HANDLERS ---
  const handleNextClick = () => {
    if (selectedLanguage) {
      // In a real app, this would navigate to the next page.
      console.log(`Navigating to next page with language: ${selectedLanguage}`);
      navigate("/login")  
    }
  };

  // --- RENDER ---
  return (
    <div className="bg-slate-100 font-sans flex items-center justify-center min-h-screen p-4">
      {/*
        The main container card.
        - p-6: Padding for mobile.
        - sm:p-8: Increased padding for tablets.
        - md:p-12: More padding for desktops.
      */}
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-6 sm:p-8 md:p-12 transform transition-all duration-300">

        {/* Header Section */}
        <header className="text-center mb-8 md:mb-10">
          {/*
            Responsive typography.
            - text-3xl: Base font size for mobile.
            - sm:text-4xl: Larger font size for tablets and up.
          */}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
            Select Your Language
          </h1>
          <p className="mt-2 text-slate-500 text-base sm:text-lg">
            Choose your preferred language to continue the experience.
          </p>
        </header>

        {/*
          Responsive Language Selection Grid.
          - grid-cols-2: 2 columns on mobile (default).
          - sm:grid-cols-3: 3 columns on tablets.
          - md:grid-cols-4: 4 columns on desktops.
          - gap-4 / md:gap-6: Adjusts spacing between cards.
        */}
        <main className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
          {languages.map((lang) => (
            <LanguageCard
              key={lang.code}
              lang={lang}
              isSelected={selectedLanguage === lang.code}
              onSelect={() => setSelectedLanguage(lang.code)}
            />
          ))}
        </main>

        {/* Footer and Action Button */}
        <footer className="mt-8 md:mt-12 pt-6 border-t border-slate-200 flex flex-col items-center">
          <Link to={"/login"}>
            <button
              type="button"
              disabled={!selectedLanguage}
              onClick={handleNextClick}
              className={`
              flex items-center justify-center w-full max-w-xs px-6 py-3.5
              text-base font-bold text-white rounded-xl shadow-md
              transform transition-all duration-300 ease-in-out
              focus:outline-none focus:ring-4 focus:ring-opacity-50
              ${selectedLanguage
                  ? 'bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-1 focus:ring-indigo-500'
                  : 'bg-slate-300 cursor-not-allowed'
                }
            `}
            >
              Next
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </button>
          </Link>
        </footer>
      </div>
    </div>
  );
};

// --- SUB-COMPONENTS ---

// A card component for displaying a single language option.
const LanguageCard = ({ lang, isSelected, onSelect }) => (
  <button
    type="button"
    onClick={onSelect}
    className={`
      p-5 text-center rounded-2xl border-2
      transform transition-all duration-200 ease-in-out
      hover:shadow-lg hover:-translate-y-1 focus:outline-none
      ${isSelected
        ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-500'
        : 'bg-white border-slate-200 hover:border-indigo-400'
      }
    `}
    aria-pressed={isSelected}
  >
    <div className={`text-4xl font-bold ${isSelected ? 'text-indigo-600' : 'text-slate-700'}`}>
      {lang.icon}
    </div>
    <div className="mt-3">
      <div className={`font-semibold text-lg ${isSelected ? 'text-indigo-900' : 'text-slate-800'}`}>
        {lang.name}
      </div>
      <div className={`text-sm ${isSelected ? 'text-indigo-700' : 'text-slate-500'}`}>
        {lang.native}
      </div>
    </div>
  </button>
);

// A simple arrow icon component using inline SVG.
const ArrowRightIcon = (props) => (
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
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);


export default LanguagePage;