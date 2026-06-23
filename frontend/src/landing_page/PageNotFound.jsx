import React from "react";
import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
  const navigate = useNavigate();

  const onGoHome = (e) => {
    e.preventDefault();
    navigate("/");  
  }

  return (
    <div className="bg-slate-100 font-sans flex items-center justify-center min-h-[60vh] text-center p-4">
      <div>
        <h1 className="text-8xl md:text-9xl font-extrabold text-indigo-600 tracking-tighter">
          404
        </h1>
        <p className="mt-2 text-2xl md:text-3xl font-bold text-slate-800">
          Page Not Found
        </p>
        <p className="mt-4 max-w-md mx-auto text-slate-500">
          Oops! The page you are looking for does not exist. It might have been moved or deleted.
        </p>
        <button
          onClick={onGoHome} // Use the callback prop here
          className="mt-8 inline-block px-8 py-3.5 text-base font-bold text-white bg-indigo-600 rounded-xl shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 transition-transform hover:-translate-y-1"
        >
          Go to Homepage
        </button>
      </div>
    </div>
  );
};

export default PageNotFound;