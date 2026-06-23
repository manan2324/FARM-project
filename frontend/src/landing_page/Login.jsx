import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../firebase/AuthContext';
import { makeAuthenticatedRequest } from '../firebase/api';

// --- SVG Icons (Self-contained components) ---
const PhoneIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);

const LockIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);


// --- Login Page Component ---
// It now takes an `onLoginSuccess` function as a prop to handle navigation.
const Login = () => {
  const [step, setStep] = useState(1);
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [mobileError, setMobileError] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { signInWithPhone, verifyOTP } = useAuth();

  const handleMobileChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Allow only digits
    if (value.length <= 10) {
      setMobile(value);
      if (value.length > 0 && value.length < 10) {
        setMobileError('Mobile number must be 10 digits.');
      } else {
        setMobileError('');
      }
    }
  };

  const handleMobileSubmit = async (e) => {
    e.preventDefault();
    if (mobile.length === 10) {
      try {
        setLoading(true);
        setError('');
        // Add country code for India
        const phoneNumber = `+91${mobile}`;
        await signInWithPhone(phoneNumber);
        setStep(2);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    } else {
      setMobileError('Please enter a valid 10-digit mobile number.');
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (otp.length === 6) {
      try {
        setLoading(true);
        setError('');
        await verifyOTP(otp);
        
        // Check if user exists in our database
        const response = await makeAuthenticatedRequest('http://localhost:5000/user');
        console.log(response);
        if (response && response.fullname) {
          // Existing user, redirect to home
          navigate("/");
        } else {
          // New user, redirect to user details
          navigate("/userinfo");
        }
      } catch (error) {
        if (error.message === 'Request failed' || error.message.includes('404')) {
          // User doesn't exist in our database
          navigate("/userinfo");
        } else {
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    } else {
      setError('Please enter a valid 6-digit OTP.');
    }
  };

  return (
    <div className="bg-slate-100 font-sans flex items-center justify-center min-h-[60vh] p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 transform transition-all duration-300">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            {step === 1 ? 'Login/Signup' : 'Enter OTP'}
          </h1>
          <p className="mt-2 text-slate-500">
            {step === 1 ? 'Enter your mobile number to sign in.' : `We've sent a code to +91${mobile}`}
          </p>
        </header>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <div id="recaptcha-container" className="mb-4"></div>

        {step === 1 ? (
          <form onSubmit={handleMobileSubmit} noValidate>
            <div className="space-y-6">
              <div>
                <label htmlFor="mobile" className="block text-sm font-medium text-slate-700 sr-only">
                  Mobile Number
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <PhoneIcon className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="tel"
                    name="mobile"
                    id="mobile"
                    value={mobile}
                    onChange={handleMobileChange}
                    className={`block w-full rounded-xl border-2 py-3 pl-10 pr-3 text-slate-900 placeholder:text-slate-400 focus:outline-none sm:text-sm ${mobileError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-slate-300 focus:ring-indigo-500 focus:border-indigo-500'}`}
                    placeholder="10-digit mobile number"
                    required
                    disabled={loading}
                  />
                </div>
                {mobileError && <p className="mt-2 text-sm text-red-600">{mobileError}</p>}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} noValidate>
            <div className="space-y-6">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-slate-700 sr-only">
                  Enter OTP
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <LockIcon className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    name="otp"
                    id="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="block w-full rounded-xl border-2 border-slate-300 py-3 pl-10 pr-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="6-digit code"
                    required
                    disabled={loading}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </div>
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                disabled={loading}
              >
                Change mobile number
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};


// --- Placeholder component to navigate to after login ---
const UserInfoPage = () => (
  <div className="bg-slate-100 font-sans flex items-center justify-center min-h-screen p-4">
    <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center">
      <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Login Successful</h1>
      <p className="mt-2 text-slate-500">Redirecting to user details...</p>
    </div>
  </div>
);


/**
 * The main App component that controls the page flow.
 * It uses state to determine which component to render,
 * removing the need for a routing library.
 */
const App = () => {
  const [currentPage, setCurrentPage] = useState('login');

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'userinfo':
        return <UserInfoPage />;
      case 'login':
      default:
        return <Login onLoginSuccess={() => setCurrentPage('userinfo')} />;
    }
  };

  return (
    <div>
      {renderCurrentPage()}
    </div>
  );
};


export default App;