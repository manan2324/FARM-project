import React, { useState } from 'react';

// --- SVG Icon Components ---
const StarIcon = ({ isFilled, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={isFilled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);
const CheckCircleIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
);


// --- Main Feedback Page Component ---
const FeedbackPage = () => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState([]);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle', 'submitting', 'success'

  const feedbackTags = ["Bug Report", "Feature Request", "Suggestion", "General Feedback"];

  const handleTagClick = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0 && selectedTags.length === 0 && !message.trim()) {
        alert("Please provide some feedback before submitting.");
        return;
    }
    
    setStatus('submitting');
    console.log("Submitting feedback:", { rating, tags: selectedTags, message });
    
    // Simulate an API call
    setTimeout(() => {
      setStatus('success');
    }, 1500);
  };
  
  if (status === 'success') {
      return (
        <div className="bg-slate-100 font-sans flex items-center justify-center min-h-screen p-4">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8 text-center">
                 <CheckCircleIcon className="w-16 h-16 text-green-600 mx-auto" />
                 <h1 className="mt-4 text-2xl font-bold text-slate-800">Thank You!</h1>
                 <p className="mt-2 text-slate-600">Your feedback has been submitted successfully. We appreciate you taking the time to help us improve.</p>
                 <button onClick={() => {
                     setStatus('idle');
                     setRating(0);
                     setSelectedTags([]);
                     setMessage('');
                 }} className="mt-6 w-full justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700">
                    Submit Another
                 </button>
            </div>
        </div>
      )
  }

  return (
    <div className="bg-slate-100 font-sans flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Share Your Feedback</h1>
          <p className="mt-2 text-slate-500">We value your opinion. Let us know how we can improve.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Star Rating */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 text-center">How would you rate your experience?</label>
            <div className="flex justify-center items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="text-amber-400 transition-transform duration-200 hover:scale-125 focus:outline-none"
                >
                  <StarIcon isFilled={(hoverRating || rating) >= star} className="w-10 h-10" />
                </button>
              ))}
            </div>
          </div>

          {/* Feedback Tags */}
          <div>
             <label className="block text-sm font-bold text-slate-700 mb-2">What is your feedback about?</label>
             <div className="flex flex-wrap gap-2">
                {feedbackTags.map(tag => (
                    <button
                        key={tag}
                        type="button"
                        onClick={() => handleTagClick(tag)}
                        className={`px-4 py-2 text-sm font-semibold rounded-full border-2 transition-colors ${selectedTags.includes(tag) ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'}`}
                    >
                        {tag}
                    </button>
                ))}
             </div>
          </div>

          {/* Message Textarea */}
          <div>
            <label htmlFor="message" className="block text-sm font-bold text-slate-700 mb-2">
              Please share any additional comments
            </label>
            <textarea
              id="message"
              name="message"
              rows="5"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us more about your experience..."
              className="block w-full rounded-xl border-2 border-slate-300 py-3 px-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform hover:-translate-y-1 disabled:bg-slate-400"
            >
              {status === 'submitting' ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : 'Submit Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackPage;