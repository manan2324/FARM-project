import React from 'react'
import { useLocation, useNavigate, useParams } from "react-router-dom";

// --- SVG Icon Components ---
const BugIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 20a8 8 0 0 0 8-8V8a8 8 0 0 0-8-8h-1a8 8 0 0 0-8 8v4a8 8 0 0 0 8 8z"></path><path d="M9 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"></path><path d="M15 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"></path><path d="m13.5 13-1-2"></path><path d="M10.5 13l1-2"></path><path d="m12 11 1 2"></path><path d="m12 11-1 2"></path></svg>;
const PillIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"></path><path d="m8.5 8.5 7 7"></path></svg>;
const AlertTriangleIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>;

const DiseaseResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const { predicted_class, predicted_label, solution, image } = location.state || {};

  if (!location.state || !predicted_label) {
    // If user comes directly without uploading
    return (
      <div className="bg-slate-100 font-sans flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center">
          <AlertTriangleIcon className="w-16 h-16 text-amber-500 mx-auto" />
          <h1 className="mt-4 text-2xl font-bold text-slate-800">No Prediction Found</h1>
          <p className="mt-2 text-slate-500">
            There was no prediction data to display. Please go back and upload an image first.
          </p>
          <button
            onClick={onScanAgain}
            className="mt-6 w-full justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Scan an Image
          </button>
        </div>
      </div>
    );
  }

  const formatLabel = (label) => {
    if (!label) return "";
    return label.replace(/___/g, " ").replace(/__/g, " ").replace(/_/g, " ");
  };

  const onScanAgain = (e) => {
    e.preventDefault();
    navigate(`/farm/${params.id}/disease-testing`);
  }

  return (
    <div className="bg-slate-100 font-sans flex items-center justify-center min-h-screen p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        <header className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">Analysis Result</h1>
        </header>

        {/* Responsive Grid: Stacks on mobile, two columns on medium screens and up */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-start">

          {/* Left Column: Image & Diagnosis */}
          <div className="space-y-6">
            <div>
              {image && (
                <img src={image} alt="Uploaded crop" className="rounded-xl shadow-md w-full object-cover aspect-video" />
              )}
            </div>
            <div>
              <h2 className="text-md sm:text-lg font-bold text-slate-800 flex items-center gap-2">
                <BugIcon className="w-6 h-6 text-red-600" />
                Diagnosis
              </h2>
              <p className="text-3xl sm:text-4xl font-extrabold text-red-700 tracking-tight mt-1">
                {formatLabel(predicted_label)}
              </p>
            </div>
          </div>

          {/* Right Column: Solution */}
          <div>
            <h2 className="text-md sm:text-lg font-bold text-slate-800 flex items-center gap-2">
              <PillIcon className="w-6 h-6 text-green-600" />
              Recommended Solution
            </h2>
            <div className="mt-2 text-slate-600 bg-slate-50 p-4 rounded-xl border-2 border-slate-200">
              <p>{solution}</p>
            </div>
            <button
              onClick={onScanAgain}
              className="mt-6 sm:mt-8 w-full py-3 sm:py-3.5 text-base font-bold text-white bg-indigo-600 rounded-xl shadow-md hover:bg-indigo-700 transition-transform hover:-translate-y-1"
            >
              Scan Another Image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DiseaseResultPage;