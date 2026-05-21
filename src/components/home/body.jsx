import React, { useState, useEffect } from "react";
import { assets } from "../../assets/assets";

function Body() {
  // Authentication state - replace this with your actual auth logic
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Existing state for chain alerts
  const [chainAlerts, setChainAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  // PWA install state
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  // Animation states
  const [isVisible, setIsVisible] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);

  // Check authentication status - replace with your actual auth check
  useEffect(() => {
    // Example auth check - replace with your actual implementation
    const checkAuthStatus = () => {
      const token = localStorage.getItem('authToken'); // or your auth method
      const user = localStorage.getItem('user'); // or your user data
      setIsLoggedIn(!!(token && user));
    };
    
    checkAuthStatus();
    
    // Trigger animations after component mounts
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  // Rotate features every 3 seconds
  useEffect(() => {
    const features = ['Real-time Monitoring', 'Instant Alerts', 'Comprehensive Reports', 'Secure Platform'];
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Function to fetch recent chain status records
const fetchChainAlerts = async () => {
  try {
    const response = await fetch(
      'http://localhost:1000/api/coach/recent-chain-status'
    );
    const data = await response.json();
    if (response.ok) {
      if (data.alerts) {
        // Directly set latest 5 records
        setChainAlerts(data.alerts.slice(0, 5));
      }
    } else {
      console.error('API Error:', data.message);
    }
  } catch (error) {
    console.error('Error fetching chain alerts:', error);
  } finally {
    setLoading(false);
  }
};

  // Function to dismiss a specific alert
  const handleDismissAlert = (alertToDismiss) => {
    setChainAlerts(currentAlerts =>
      currentAlerts.filter(alert => alert._id !== alertToDismiss._id)
    );
  };

  // Function to clear all alerts
  const handleClearAllAlerts = () => {
    setChainAlerts([]);
  };

  // PWA install handler
  const handleInstallPWA = async () => {
    if (!deferredPrompt) {
      alert('PWA installation is not available at this time.');
      return;
    }

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User ${outcome} the install prompt`);
      
      if (outcome === 'accepted') {
        console.log('PWA installation accepted');
      }
      
      setDeferredPrompt(null);
      setShowInstallButton(false);
    } catch (error) {
      console.error('Error during PWA installation:', error);
    }
  };

  // Setup PWA install prompt listener
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
      console.log('PWA install prompt available');
    };

    const handleAppInstalled = () => {
      console.log('PWA was installed');
      setIsInstalled(true);
      setShowInstallButton(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

    // Fetch alerts on component mount and set up polling for all users
    useEffect(() => {
      fetchChainAlerts();
      const interval = setInterval(fetchChainAlerts, 10000);
      return () => clearInterval(interval);
    }, []);

  // Function to format timestamp for better readability
  const formatTime = (isoString) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  const features = [
    { icon: '🚆', text: 'Real-time Monitoring', color: 'from-blue-500 to-cyan-500' },
    { icon: '🔔', text: 'Instant Alerts', color: 'from-red-500 to-pink-500' },
    { icon: '📊', text: 'Comprehensive Reports', color: 'from-green-500 to-emerald-500' },
    { icon: '🔒', text: 'Secure Platform', color: 'from-purple-500 to-violet-500' }
  ];

  return (
    <>
      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(1deg); }
          66% { transform: translateY(5px) rotate(-1deg); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
          50% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.6), 0 0 40px rgba(59, 130, 246, 0.3); }
        }
        
        @keyframes slide-in-left {
          from { transform: translateX(-100px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slide-in-right {
          from { transform: translateX(100px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slide-in-up {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        .animate-slide-in-left { animation: slide-in-left 0.8s ease-out forwards; }
        .animate-slide-in-right { animation: slide-in-right 0.8s ease-out forwards; }
        .animate-slide-in-up { animation: slide-in-up 0.6s ease-out forwards; }
        .animate-gradient-shift { 
          background-size: 200% 200%;
          animation: gradient-shift 4s ease infinite;
        }
        .animate-bounce-subtle { animation: bounce-subtle 2s ease-in-out infinite; }
        
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-400 { animation-delay: 0.4s; }
        .animation-delay-600 { animation-delay: 0.6s; }
        .animation-delay-800 { animation-delay: 0.8s; }
        .animation-delay-1000 { animation-delay: 1s; }
      `}</style>

      <div className="min-h-screen lg:h-[75vh] flex flex-col px-4 py-8 lg:px-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden relative">
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float animation-delay-1000"></div>
          <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-gradient-to-r from-cyan-300 to-blue-300 rounded-full mix-blend-multiply filter blur-lg opacity-30 animate-bounce-subtle"></div>
        </div>

        {/* Notice Board Section - Now visible for all users */}
        <div className={`w-full mb-8 transform transition-all duration-1000 ease-out ${
          isVisible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'
        } animate-slide-in-up`}>
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-500 animate-pulse-glow">
            <div className="bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white px-6 py-4 flex justify-between items-center animate-gradient-shift">
              <h2 className="text-xl font-bold flex items-center">
                <div className="w-6 h-6 mr-3 animate-bounce-subtle">
                  <svg fill="currentColor" viewBox="0 0 20 20" className="w-full h-full">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                Chain Status Notice Board
                {chainAlerts.length > 0 && (
                  <span className="ml-3 bg-white text-red-600 px-3 py-1 rounded-full text-sm font-bold animate-pulse shadow-lg">
                    {chainAlerts.length}
                  </span>
                )}
              </h2>
              {chainAlerts.length > 0 && (
                <button
                  onClick={handleClearAllAlerts}
                  className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
                  title="Clear all alerts"
                >
                  Clear All
                </button>
              )}
            </div>
            
            <div className="p-6 max-h-48 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
                  <span className="ml-3 text-gray-600 font-medium">Loading alerts...</span>
                </div>
              ) : chainAlerts.length === 0 ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300">
                    <svg className="w-6 h-6 mr-2 animate-bounce-subtle" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    No Chain Pulled - All Systems Normal
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {chainAlerts.map((alert, index) => (
                    <div 
                      key={alert._id || index} 
                      className={`relative bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-4 shadow-md transform transition-all duration-500 hover:scale-102 hover:shadow-lg animate-slide-in-up`}
                      style={{ animationDelay: `${index * 150}ms` }}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg className="w-6 h-6 text-red-500 mt-1 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="text-red-800 font-bold text-lg">
                            🚨 ALERT: Chain Pulled - Train {alert.train_Number}
                          </h3>
                          <p className="text-red-700 text-sm mt-2 font-medium">
                            Coach: {alert.coach} | Status: {alert.chain_status}
                          </p>
                          <p className="text-red-600 text-xs mt-2">
                            Time: {formatTime(alert.createdAt)}
                          </p>
                          {alert.location && (alert.latitude || alert.longitude) && (
                            <p className="text-red-600 text-xs mt-1">
                              📍 Location: {alert.latitude}, {alert.longitude}
                            </p>
                          )}
                        </div>
                        <button 
                          onClick={() => handleDismissAlert(alert)} 
                          className="absolute top-3 right-3 text-red-500 hover:text-red-700 transition-all duration-300 transform hover:scale-125 hover:rotate-90 p-1 rounded-full hover:bg-white/50"
                          title="Dismiss Alert"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Section */}
        <div className="flex flex-col-reverse lg:flex-row items-center justify-center flex-1 relative z-10">
          {/* Left Section - Text Content */}
          <div className={`w-full lg:w-1/2 flex flex-col items-center lg:items-start justify-center mt-8 lg:mt-0 text-center lg:text-left p-4 transform transition-all duration-1000 ease-out ${
            isVisible ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'
          } animate-slide-in-left`}>
            
            {/* Status Badge */}
            <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-md rounded-full shadow-lg mb-8 border border-white/30 animate-bounce-subtle">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></div>
              <span className="text-indigo-700 font-semibold text-sm tracking-wide">🚀 LIVE RAILWAY MONITORING</span>
            </div>

            {/* Animated Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 drop-shadow-lg animate-gradient-shift">
              Welcome to{' '}
              <span className="relative">
                Rail Watch
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full animate-pulse"></div>
              </span>
            </h1>

            {/* Dynamic Description */}
            <div className="mt-8 space-y-3 animate-slide-in-up animation-delay-400">
              <p className="text-lg lg:text-xl text-gray-700 leading-relaxed max-w-2xl font-medium">
                Empowering railway employees with{' '}
                <span className="font-bold text-indigo-600 animate-pulse">real-time train chain monitoring.</span>
              </p>
              <p className="text-lg lg:text-xl text-gray-700 leading-relaxed max-w-2xl">
                Ensure safety and operational integrity with instant updates and comprehensive reports.
              </p>
            </div>

            {/* Rotating Feature Highlight */}
            <div className="mt-6 animate-slide-in-up animation-delay-600">
              <div className="flex items-center justify-center lg:justify-start space-x-3 p-4 bg-white/60 backdrop-blur-md rounded-xl shadow-lg border border-white/20 transform hover:scale-105 transition-all duration-300">
                <span className="text-3xl animate-bounce-subtle">{features[currentFeature].icon}</span>
                <span className={`font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r ${features[currentFeature].color}`}>
                  {features[currentFeature].text}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className={`mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center lg:justify-start animate-slide-in-up animation-delay-800`}>
              {/* Discover Button */}
              <button
                onClick={() => { /* Add navigation */ }}
                className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white font-bold rounded-full shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300 cursor-pointer animate-pulse-glow overflow-hidden"
              >
                <span className="relative z-10">Discover More</span>
                <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform duration-300 relative z-10" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>

              {/* PWA Install Button */}
              {showInstallButton && !isInstalled && (
                <button
                  onClick={handleInstallPWA}
                  className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-full shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-300 cursor-pointer"
                  title="Install Rail Watch App"
                >
                  <svg className="w-5 h-5 mr-2 transform group-hover:scale-125 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Install App
                </button>
              )}

              {/* App Installed Message */}
              {isInstalled && (
                <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-full border border-green-300 shadow-lg animate-bounce-subtle">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  ✨ App Installed!
                </div>
              )}
            </div>
          </div>

          {/* Right Section - Enhanced Image */}
          <div className={`w-full lg:w-1/2 flex items-center justify-center p-8 transform transition-all duration-1000 ease-out ${
            isVisible ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'
          } animate-slide-in-right animation-delay-400`}>
            <div className="relative group">
              {/* Glowing background */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-500 rounded-2xl blur-2xl opacity-20 group-hover:opacity-40 transition-all duration-500 animate-pulse-glow"></div>
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-all duration-500 animate-float"></div>
              
              <img
                src={assets.train}
                alt="Advanced railway monitoring system"
                className="relative w-full max-w-sm lg:max-w-lg object-contain rounded-2xl shadow-2xl transform group-hover:scale-110 transition-all duration-700 ease-out animate-float backdrop-blur-sm"
              />
              
              {/* Floating decorative elements */}
              <div className="absolute top-1/4 -left-4 w-4 h-4 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-bounce-subtle animation-delay-200"></div>
              <div className="absolute top-3/4 -right-4 w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-bounce-subtle animation-delay-600"></div>
              <div className="absolute bottom-1/4 -left-3 w-2 h-2 bg-gradient-to-r from-indigo-400 to-blue-400 rounded-full animate-float animation-delay-1000"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Body;