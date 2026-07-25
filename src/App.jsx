// src/App.jsx
import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import HomePageHeader from './components/home/HomePageHeader.jsx';
import OrganizationHeader from './components/home/OrganizationHeader.jsx';

// Pages & Components
import Home from './pages/Home.jsx';
import Navbar from './components/Navbar/Navbar.jsx';
import Footer from './components/Footer/Footer.jsx';
import LogIn from './pages/login.jsx';
import Signup from './pages/signup.jsx';
import ContactUs from './pages/ContactUs.jsx';
import Profile from './pages/Profile.jsx';
import Dashboard from './pages/dashboard.jsx';
import ViewResources from './components/viewResources/ViewResources.jsx';
import CoachDetails from './pages/CoachDetails.jsx';
import Admin from './pages/Admin.jsx';
import AddTrain from './pages/AddTrain.jsx';

// Small, safe inline PWA installer
function InstallPWAInline() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const onBeforeInstall = (e) => {
      // avoid mini-infobar on mobile
      e.preventDefault();
      setDeferredPrompt(e);
      setVisible(true);
    };

    const onInstalled = () => {
      setInstalled(true);
      setVisible(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    try {
      await deferredPrompt.userChoice; // { outcome: 'accepted' | 'dismissed' }
    } finally {
      setDeferredPrompt(null);
      setVisible(false);
    }
  };

  if (!visible || installed) return null;

  return (
    <button
      onClick={handleInstall}
      className="fixed bottom-5 right-5 z-50 rounded-xl border border-sky-500 bg-white px-4 py-2 text-sky-600 shadow-md hover:bg-sky-50 focus:outline-none"
      aria-label="Install Rail Watch"
      title="Install Rail Watch"
    >
      Install App
    </button>
  );
}

function AppLayout() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col">
      <HomePageHeader />
      <OrganizationHeader />
      <Navbar />

      <div className="flex-grow">
        <Routes>
          {/* Home */}
          <Route path="/" element={<Home />} />

          {/* Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Auth */}
          <Route path="/login" element={<LogIn />} />
          <Route path="/signup" element={<Signup />} />

          {/* Contact & Profile */}
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/profile" element={<Profile />} />

          {/* Dynamic routes */}
          <Route path="/division-id/:id" element={<ViewResources />} />
          <Route path="/coach-details/:trainNumber/:coach" element={<CoachDetails />} />

          {/* Admin */}
          <Route path="/admin-dashboard" element={<Admin />} />
          <Route path="/add-train" element={<AddTrain />} />

          {/* 404 */}
          <Route
            path="*"
            element={
              <div className="py-16 text-center text-xl text-red-600">
                404 - Page Not Found
              </div>
            }
          />
        </Routes>
      </div>

      <Footer />

      {/* PWA install CTA (only shows when eligible) */}
      <InstallPWAInline />
    </div>
  );
}

export default function App() {
  return <AppLayout />;
}
