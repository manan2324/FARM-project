import React from 'react';

// Logo component using the image from public folder
const Logo = () => (
  <img 
    src="/Logo.png" 
    alt="F.A.R.M Logo" 
    className="h-10 w-auto object-contain brightness-125" // brightness-125 to make it more visible on dark background
  />
);

// A dictionary of social media icons as inline SVG components.
const socialIcons = {
  Facebook: (
    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v2.385z" /></svg>
  ),
  Instagram: (
     <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.012 3.584-.07 4.85c-.148 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.012-3.584.07-4.85c.148-3.225 1.664-4.771 4.919-4.919 1.266.058 1.644.07 4.85.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.058 1.281-.072 1.689-.072 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.058-1.281.072-1.689.072-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98-1.281-.058-1.689-.072-4.948-.072zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.441 1.441 1.441 1.441-.645 1.441-1.441-.645-1.44-1.441-1.44z" /></svg>
  ),
  Twitter: (
    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616v.064c0 2.299 1.634 4.217 3.793 4.65-1.002.272-1.928.31-2.828.113.626 1.954 2.434 3.374 4.589 3.415-2.155 1.685-4.873 2.69-7.828 2.69-.508 0-1.009-.03-1.508-.088 2.787 1.793 6.102 2.842 9.649 2.842 11.58 0 17.93-9.588 17.81-17.93l-.009-.008c1.236-.894 2.308-2.015 3.153-3.271z" /></svg>
  ),
};

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="space-y-8 text-center">
          {/* Brand Info */}
          <div className="flex justify-center items-center gap-3">
            <Logo />
            <span className="text-2xl font-bold text-white">F.A.R.M</span>
          </div>
          <p className="text-base">
            Providing farmers with data-driven insights for a better harvest.
          </p>

          {/* Social Links */}
          <div className="flex justify-center space-x-6">
            {Object.entries(socialIcons).map(([name, icon]) => (
              <a key={name} href="#" className="hover:text-white">
                <span className="sr-only">{name}</span>
                {icon}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom Copyright Section */}
        <div className="mt-12 border-t border-slate-800 pt-8">
          <p className="text-base text-center">
            &copy; {currentYear} F.A.R.M . All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
