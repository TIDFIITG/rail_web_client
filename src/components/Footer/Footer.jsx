import React from "react";
// Import social media icons from react-icons/io5
import {
  IoLogoGithub,
  IoLogoLinkedin,
  IoLogoTwitter,
  IoMail,
  IoHeart,
  IoTrain
} from "react-icons/io5";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-slate-900 via-gray-900 to-slate-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <IoTrain className="text-3xl text-blue-400" />
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Rail Watch
              </h3>
            </div>
            <p className="text-gray-400 leading-relaxed text-sm">
              Revolutionizing railway safety with real-time chain monitoring. 
              Empowering railway professionals with cutting-edge technology for enhanced operational integrity.
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>Made with</span>
              <IoHeart className="text-red-500 animate-pulse" />
              <span>for railway safety</span>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <nav className="space-y-2">
              <a href="/" className="block text-gray-400 hover:text-blue-400 transition-colors duration-300 text-sm hover:translate-x-1 transform">
                Home
              </a>
              <a href="/dashboard" className="block text-gray-400 hover:text-blue-400 transition-colors duration-300 text-sm hover:translate-x-1 transform">
                Dashboard
              </a>
              <a href="/contact-us" className="block text-gray-400 hover:text-blue-400 transition-colors duration-300 text-sm hover:translate-x-1 transform">
                Contact Us
              </a>
              <a href="/profile" className="block text-gray-400 hover:text-blue-400 transition-colors duration-300 text-sm hover:translate-x-1 transform">
                Profile
              </a>
            </nav>
          </div>

          {/* Contact & Social Section */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white mb-4">Connect With Developer</h4>
            
            {/* Developer Info */}
            <div className="space-y-2">
              <p className="text-gray-400 text-sm">Devarpana Tribedi</p>
              <p className="text-gray-400 text-sm">Akarshan Ghosh</p>
              <a 
                href="mailto:contact@akarshanghosh.dev" 
                className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors duration-300 text-sm"
              >
                <IoMail className="text-lg" />
                <span>Get in touch</span>
              </a>
            </div>

            {/* Social Media Links */}
            <div className="flex items-center space-x-4 pt-2">
              {/* GitHub Link */}
              <a
                href="https://github.com/Devarpana"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
                className="group relative p-3 rounded-full bg-gray-800 hover:bg-gray-700 transition-all duration-300 transform hover:scale-110 hover:rotate-6"
              >
                <IoLogoGithub className="text-xl text-gray-400 group-hover:text-white transition-colors duration-300" />
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  GitHub
                </div>
              </a>

              {/* LinkedIn Link */}
              <a
                href="https://www.linkedin.com/in/devarpana-tribedi"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
                className="group relative p-3 rounded-full bg-gray-800 hover:bg-blue-600 transition-all duration-300 transform hover:scale-110 hover:rotate-6"
              >
                <IoLogoLinkedin className="text-xl text-gray-400 group-hover:text-white transition-colors duration-300" />
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  LinkedIn
                </div>
              </a>

              {/* Twitter (X) Link */}
              <a
                href="https://x.com/AkarshanGhosh28"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter Profile"
                className="group relative p-3 rounded-full bg-gray-800 hover:bg-blue-500 transition-all duration-300 transform hover:scale-110 hover:rotate-6"
              >
                <IoLogoTwitter className="text-xl text-gray-400 group-hover:text-white transition-colors duration-300" />
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Twitter
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            
            {/* Copyright Information */}
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>&copy; {new Date().getFullYear()}</span>
              <span className="text-blue-400 font-semibold">Devarpana Tribedi</span>
              <span>• All Rights Reserved</span>
            </div>

            {/* Tech Stack Badge */}
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>System Operational</span>
              </div>
              <div className="hidden md:block">
                <span className="px-2 py-1 bg-gray-800 rounded text-gray-400">
                  Built with React & ❤️
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle animated background effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-5 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-5 animate-blob animation-delay-2000"></div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </footer>
  );
};

export default Footer;