import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../firebase/AuthContext';

// --- SVG Icon Components ---
const MenuIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);
const XIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

// The main Navbar component, simplified to show only the logo and brand name.
const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const navLinks = [
    { to: "/crop-guidance", label: "Crop Guidance" },
    { to: "/chatbot", label: "Chatbot" },
    { to: "/market", label: "Market" },
    { to: "/feedback", label: "Feedback" },
    { to: "/help", label: "Help & Support" },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      // Optionally show error
      alert('Logout failed.');
    }
  };

  const handleLinkClick = (e, path) => {
    e.preventDefault();
    navigate(path);
    setIsMenuOpen(false); // Close mobile menu on navigation
  }

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo and Brand Name Section */}
          <Link to={"/"} className="flex-shrink-0 flex items-center gap-3">
            <div className="w-auto flex items-center">
              <img
                src="/Logo.png"
                alt="F.A.R.M Logo"
                className="h-10 w-auto object-contain"
              />
            </div>
            <p to={"/"} className='text-2xl font-bold text-slate-800'>
              F.A.R.M
            </p>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to} onClick={(e) => handleLinkClick(e, link.to)} className="font-semibold text-slate-600 hover:text-indigo-600 transition-colors">
                {link.label}
              </Link>
            ))}
          </div>

          {/* Logout Button */}
          <div className='flex items-center gap-4'>
            {currentUser && (
              <button
                onClick={handleLogout}
                className="hidden md:inline-flex ml-4 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition"
              >
                Logout
              </button>
            )}
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-slate-600 hover:text-slate-900">
                {isMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 space-y-2 border-t-2 border-slate-100">
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} onClick={(e) => handleLinkClick(e, link.to)} className="block px-3 py-2 rounded-md text-base font-semibold text-slate-700 hover:bg-slate-100 hover:text-indigo-600">
              {link.label}
            </Link>
          ))}
          <div className="pt-2">
            {currentUser ? (
              <button
                onClick={handleLogout}
                className="ml-1 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition"
              >
                Logout
              </button>
            ) : (
              <Link to="/login" onClick={(e) => handleLinkClick(e, '/login')} className="block px-3 py-2 rounded-md text-base font-semibold text-slate-700 hover:bg-slate-100 hover:text-indigo-600">Login</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;