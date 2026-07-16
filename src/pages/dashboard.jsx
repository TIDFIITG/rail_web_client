import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loder";
import ResourceCard from "../components/ResourceCard/ResourceCard";
import axios from "axios";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [stats, setStats] = useState({
    totalTrains: 0,
    totalDivisions: 0,
    totalStates: 0,
    totalCities: 0
  });
  const navigate = useNavigate();

  // Check if the user is authenticated
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  // Calculate stats from data
  const calculateStats = (data) => {
    const uniqueDivisions = new Set(data.map(item => item.division)).size;
    const uniqueStates = new Set(data.map(item => item.state)).size;
    const uniqueCities = new Set(data.map(item => item.cities)).size;
    
    setStats({
      totalTrains: data.length,
      totalDivisions: uniqueDivisions,
      totalStates: uniqueStates,
      totalCities: uniqueCities
    });
  };

  // Fetch all resources if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const fetchData = async () => {
        try {
          const response = await axios.get("https://rail-web-server-r7z1.onrender.com/api/division/get-all-division", {
            headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
          });
          const formattedData = response.data.data.map((item, index) => ({
            ...item,
            trainName: item.train_Name || "",
            trainNumber: item.train_Number || "",
            division: item.division || "",
            state: item.states || "",
            cities: item.cities || "",
            animationDelay: index * 0.1 // For staggered animations
          }));
          setData(formattedData);
          setFilteredData(formattedData);
          calculateStats(formattedData);
        } catch (error) {
          console.error("Error fetching all resources:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [isAuthenticated]);

  // Handle search input
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter data based on search term
  useEffect(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const filtered = data.filter((item) => {
      return (
        (item.trainName?.toLowerCase().includes(lowerSearchTerm) || "") ||
        (item.trainNumber?.toString().includes(lowerSearchTerm) || "") ||
        (item.division?.toLowerCase().includes(lowerSearchTerm) || "") ||
        (item.state?.toLowerCase().includes(lowerSearchTerm) || "") ||
        (item.cities?.toLowerCase().includes(lowerSearchTerm) || "")
      );
    });

    // Add animation delay for filtered results
    const filteredWithDelay = filtered.map((item, index) => ({
      ...item,
      animationDelay: index * 0.05
    }));

    setFilteredData(filteredWithDelay);
  }, [searchTerm, data]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-10 -left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute top-1/3 -right-10 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-10 left-1/3 w-80 h-80 bg-indigo-200/30 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 px-4 py-8 lg:px-12 lg:py-12">
        {/* Header Section */}
        <div className="text-center mb-12 animate-fade-in-down">
          <h1 className="text-5xl lg:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 animate-gradient-x">
            Railway Dashboard
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Monitor and manage railway operations with real-time insights and comprehensive train management
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-12 animate-slide-up">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/30 hover:shadow-2xl hover:scale-105 transition-all duration-500 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Trains</p>
                <p className="text-3xl font-bold text-indigo-600 group-hover:text-indigo-700 transition-colors">
                  {stats.totalTrains}
                </p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/30 hover:shadow-2xl hover:scale-105 transition-all duration-500 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Divisions</p>
                <p className="text-3xl font-bold text-green-600 group-hover:text-green-700 transition-colors">
                  {stats.totalDivisions}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/30 hover:shadow-2xl hover:scale-105 transition-all duration-500 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">States</p>
                <p className="text-3xl font-bold text-purple-600 group-hover:text-purple-700 transition-colors">
                  {stats.totalStates}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/30 hover:shadow-2xl hover:scale-105 transition-all duration-500 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Cities</p>
                <p className="text-3xl font-bold text-orange-600 group-hover:text-orange-700 transition-colors">
                  {stats.totalCities}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Search Bar */}
        <div className="flex justify-center mb-12 animate-fade-in" style={{animationDelay: '0.3s'}}>
          <div className="relative w-full max-w-4xl">
            <div className={`absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur-sm transition-all duration-500 ${searchFocused ? 'opacity-75 scale-105' : 'opacity-0 scale-100'}`}></div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search trains by name, number, division, state, or city..."
                className={`w-full p-6 rounded-2xl text-gray-800 text-lg
                           bg-white/80 backdrop-blur-lg border-2 transition-all duration-500
                           focus:outline-none focus:ring-0 focus:border-transparent
                           shadow-xl hover:shadow-2xl placeholder-gray-500
                           ${searchFocused ? 'bg-white/90 scale-105' : 'border-white/30'}`}
                value={searchTerm}
                onChange={handleSearch}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
              <div className="absolute right-6 top-1/2 transform -translate-y-1/2">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        {!loading && (
          <div className="text-center mb-8 animate-fade-in" style={{animationDelay: '0.5s'}}>
            <p className="text-lg text-gray-600">
              {searchTerm ? (
                <span>
                  Found <span className="font-bold text-indigo-600">{filteredData.length}</span> results 
                  {searchTerm && <span> for "<span className="font-semibold">{searchTerm}</span>"</span>}
                </span>
              ) : (
                <span>Showing all <span className="font-bold text-indigo-600">{filteredData.length}</span> trains</span>
              )}
            </p>
          </div>
        )}

        {/* Content Section */}
        {loading ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <div className="relative mb-8">
                <div className="w-20 h-20 border-4 border-indigo-200 rounded-full animate-spin mx-auto"></div>
                <div className="w-20 h-20 border-4 border-indigo-600 rounded-full animate-spin absolute top-0 left-1/2 transform -translate-x-1/2" 
                     style={{borderRightColor: 'transparent', animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Loading Dashboard</h3>
              <p className="text-gray-600">Fetching railway data...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-12">
            {filteredData.length > 0 ? (
              filteredData.map((item, i) => (
                <div 
                  key={i}
                  className="animate-fade-in-up"
                  style={{
                    animationDelay: `${item.animationDelay || i * 0.1}s`,
                    animationFillMode: 'backwards'
                  }}
                >
                  <ResourceCard data={item} />
                </div>
              ))
            ) : (
              <div className="col-span-full animate-fade-in">
                <div className="text-center p-12 rounded-3xl bg-white/80 backdrop-blur-lg shadow-2xl border border-white/30">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">No Results Found</h3>
                  <p className="text-gray-600 mb-6">
                    {searchTerm 
                      ? `We couldn't find any trains matching "${searchTerm}". Try adjusting your search terms.`
                      : "No train resources are currently available."
                    }
                  </p>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                    >
                      Clear Search
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(20px, -30px) scale(1.1);
          }
          66% {
            transform: translate(-10px, 10px) scale(0.9);
          }
        }

        @keyframes gradient-x {
          0%, 100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }

        .animate-fade-in-down {
          animation: fade-in-down 0.8s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
          background-size: 200% 200%;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;