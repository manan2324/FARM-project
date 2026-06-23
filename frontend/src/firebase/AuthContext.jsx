import { createContext, useContext, useEffect, useState } from 'react';
import { 
  RecaptchaVerifier,
  signInWithPhoneNumber,
  onAuthStateChanged,
  signOut
} from 'firebase/auth';
import { auth } from './config';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verificationId, setVerificationId] = useState(null);

  // Setup recaptcha verifier
  const setupRecaptcha = async (phoneNumber) => {
    try {
      // Clear any existing reCAPTCHA instance
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }

      // Create new reCAPTCHA instance
      const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {
          console.log('reCAPTCHA verified');
        }
      });

      // Render the reCAPTCHA widget
      await verifier.render();
      window.recaptchaVerifier = verifier;

      return signInWithPhoneNumber(auth, phoneNumber, verifier);
    } catch (error) {
      console.error('Error setting up reCAPTCHA:', error);
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
      throw error;
    }
  };

  // Phone number sign in
  const signInWithPhone = async (phoneNumber) => {
    try {
      // Ensure phone number is in E.164 format
      const formattedNumber = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
      console.log('Attempting to send OTP to:', formattedNumber);
      
      const confirmationResult = await setupRecaptcha(formattedNumber);
      console.log('OTP sent successfully');
      setVerificationId(confirmationResult);
      return true;
    } catch (error) {
      console.error("Error sending verification code:", error);
      // Check for specific Firebase error codes
      if (error.code === 'auth/invalid-phone-number') {
        throw new Error('Invalid phone number format. Please enter a valid number with country code.');
      } else if (error.code === 'auth/quota-exceeded') {
        throw new Error('SMS quota exceeded. Please try again later.');
      } else if (error.code === 'auth/too-many-requests') {
        throw new Error('Too many requests. Please try again later.');
      }
      throw error;
    }
  };

  // Verify OTP code
  const verifyOTP = async (otp) => {
    try {
      if (!verificationId) throw new Error("No verification ID found");
      const result = await verificationId.confirm(otp);
      setCurrentUser(result.user);
      return result.user;
    } catch (error) {
      console.error("Error verifying OTP:", error);
      throw error;
    }
  };

  // Sign out
  const logout = () => {
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signInWithPhone,
    verifyOTP,
    logout,
    verificationId
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}