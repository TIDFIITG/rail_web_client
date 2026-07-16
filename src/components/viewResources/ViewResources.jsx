import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowRightLeft } from "lucide-react";
import Loader from "../Loder"; // Assuming Loader is a well-styled component

const ViewResources = () => {
  const { id } = useParams(); // Extract resource ID from the URL
  const navigate = useNavigate(); // For navigation
  const [data, setData] = useState(null);
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [allTrains, setAllTrains] = useState([]);
  const [selectedTrain, setSelectedTrain] = useState("");

  // Check if the user is authenticated
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchData = async () => {
        try {
          // First fetch train details from Division
          const response = await axios.get(`https://rail-web-server-r7z1.onrender.com/api/division/division-id/${id}`, {
            headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
          });
          const trainDetails = response.data.data;
          setData(trainDetails);

          // Then fetch available coaches using the train number
          const coachesResponse = await axios.post(
            "https://rail-web-server-r7z1.onrender.com/api/coach/get-coach",
            { train_Number: trainDetails.train_Number },
            { headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` } }
          );

          console.log("Coaches Response:", coachesResponse.data);

          // Handle the response structure properly
          if (coachesResponse.data.coaches?.length > 0) {
            setCoaches(coachesResponse.data.coaches);
            
            // If train_info is available in coaches response, update the data
            if (coachesResponse.data.train_info) {
              setData(prevData => ({
                ...prevData,
                ...coachesResponse.data.train_info
              }));
            }
          } else {
            setCoaches([]);
          }
        } catch (error) {
          console.error("Error fetching data:", error.response?.data || error.message);
          setError(true);
          setErrorMessage(error.response?.data?.message || "Failed to load resource. Please try again later.");
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [id, isAuthenticated]);

  const handleCoachClick = (coach) => {
    const coachUid = coach.uid;
    navigate(`/coach-details/${data.train_Number}/${coachUid}`);
  };


  const fetchAllTrains = async () => {
  try {
    const response = await axios.get(
      "https://rail-web-server-r7z1.onrender.com/api/division/get-all-division",
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );

    console.log(response.data);

    setAllTrains(response.data.data);
  } catch (error) {
    console.error(error);
  }
};

   const handleTransferCoach = async () => {
  try {

    if (!selectedTrain) {
      alert("Please select a destination train.");
      return;
    }

    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/division/transfer-coach`,
      {
        coach_uid: selectedCoach.uid,
        fromDivisionId: data._id,
        toDivisionId: selectedTrain,
      },
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );

    alert(response.data.message);

    setShowTransferModal(false);

  } catch (error) {
    console.error(error);

    alert(
      error.response?.data?.message ||
      "Transfer failed."
    );
  }
};

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="flex flex-col items-center space-y-6 animate-pulse">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-200 rounded-full animate-spin"></div>
            <div className="w-16 h-16 border-4 border-indigo-600 rounded-full animate-spin absolute top-0 left-0" style={{borderRightColor: 'transparent', animationDirection: 'reverse', animationDuration: '1s'}}></div>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading Train Details</h2>
            <p className="text-gray-600">Please wait while we fetch the information...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-orange-50 to-rose-50">
        <div className="text-center p-8 rounded-2xl bg-white/90 backdrop-blur-sm shadow-2xl border border-red-200 max-w-md mx-4 animate-bounce-in">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-red-800 mb-4">Oops! Something went wrong</h2>
          <p className="text-red-600 mb-6">{errorMessage}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    data && (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12 animate-fade-in-down">
            <h1 className="text-5xl lg:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
              🚂 Train Details
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full"></div>
          </div>

          {/* Train Information Card */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 mb-10 border border-white/30 animate-slide-up">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="group p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold">🚄</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700">Train Name</h3>
                </div>
                <p className="text-xl font-bold text-gray-900">{data.train_Name}</p>
              </div>

              <div className="group p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold">#</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700">Train Number</h3>
                </div>
                <p className="text-xl font-bold text-gray-900">{data.train_Number}</p>
              </div>

              <div className="group p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold">🏢</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700">Division</h3>
                </div>
                <p className="text-xl font-bold text-gray-900">{data.division}</p>
              </div>

              <div className="group p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl border border-orange-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold">🗺️</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700">State</h3>
                </div>
                <p className="text-xl font-bold text-gray-900">{data.states}</p>
              </div>

              <div className="group p-6 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl border border-teal-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold">🏙️</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700">City</h3>
                </div>
                <p className="text-xl font-bold text-gray-900">{data.cities}</p>
              </div>
            </div>
          </div>

          {/* Available Coaches Section */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/30 animate-slide-up" style={{animationDelay: '0.2s'}}>
            <div className="text-center mb-8">
              <h2 className="text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                🚃 Available Coaches
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full"></div>
            </div>
            
            {coaches.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {coaches.map((coach, index) => (
                  <div 
                    key={coach.uid} 
                    className="group relative animate-fade-in-up"
                    style={{animationDelay: `${index * 0.1}s`}}
                  >

                    <button
                      onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCoach(coach);
                            fetchAllTrains();
                            setShowTransferModal(true);
                      }}
                      className="absolute top-3 right-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur hover:bg-white/40 transition"
                      title="Transfer Coach"
                    >
                      <ArrowRightLeft size={16} />
                    </button>


                    <button
                      onClick={() => handleCoachClick(coach)}
                      className="w-full p-6 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl 
                                 hover:shadow-2xl transform hover:scale-105 transition-all duration-300 
                                 focus:outline-none focus:ring-4 focus:ring-indigo-300 relative overflow-hidden
                                 before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/0 before:via-white/20 before:to-white/0 
                                 before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700"
                    >
                      <div className="relative z-10">
                        <div className="text-center space-y-3">
                          <div className="text-3xl mb-2">🚃</div>
                          <h3 className="text-xl font-bold">{coach.coach_name}</h3>
                          <div className="flex items-center justify-center space-x-2">
                            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                              UID: {coach.uid}
                            </span>
                          </div>
                          {coach.hasActiveEntries && (
                            <div className="flex justify-center">
                              <span className="text-xs bg-green-400 text-green-900 px-3 py-1 rounded-full font-semibold animate-pulse">
                                ● Active
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 animate-fade-in">
                <div className="text-6xl mb-4">🚫</div>
                <h3 className="text-2xl font-bold text-gray-700 mb-4">No Coaches Available</h3>
                <p className="text-gray-600 mb-2">No coaches are currently available for this train.</p>
                <p className="text-sm text-gray-500">Please check if coaches are configured in the division settings.</p>
              </div>
            )}

            {showTransferModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

                <h2 className="mb-6 text-2xl font-bold text-center">
                  🔄 Transfer Coach
                </h2>

                <p className="mb-6 text-center text-gray-600">
                  Coach: <strong>{selectedCoach?.coach_name}</strong>
                </p>

                <>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Select Destination Train
                  </label>

                  <select
                    value={selectedTrain}
                    onChange={(e) => setSelectedTrain(e.target.value)}
                    className="mb-5 w-full rounded-xl border border-gray-300 p-3 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="">Choose a train</option>

                    {allTrains
                      .filter((train) => train._id !== data._id)
                      .map((train) => (
                        <option key={train._id} value={train._id}>
                          {train.train_Name} ({train.train_Number})
                        </option>
                      ))}
                  </select>

                  <button
                    onClick={handleTransferCoach}
                    className="mb-4 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
                  >
                    Transfer Coach
                  </button>
                </>

                <button
                  className="mb-6 w-full rounded-xl bg-green-600 py-3 font-semibold text-white hover:bg-green-700"
                >
                  🚆 Create New Train
                </button>

                <button
                  onClick={() => setShowTransferModal(false)}
                  className="w-full rounded-xl border py-3 hover:bg-gray-100"
                >
                  Cancel
                </button>

              </div>
            </div>
          )}
          </div>

          {/* Back Button */}
          <div className="text-center mt-10 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
            <button
              onClick={() => navigate(-1)}
              className="px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 
                         text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105
                         focus:outline-none focus:ring-4 focus:ring-gray-300 shadow-lg hover:shadow-xl"
            >
              ← Back to Previous Page
            </button>
        </div>
        
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

          @keyframes bounce-in {
            0% {
              opacity: 0;
              transform: scale(0.3);
            }
            50% {
              opacity: 1;
              transform: scale(1.05);
            }
            70% {
              transform: scale(0.9);
            }
            100% {
              opacity: 1;
              transform: scale(1);
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

          .animate-fade-in-down {
            animation: fade-in-down 0.6s ease-out;
          }

          .animate-slide-up {
            animation: slide-up 0.8s ease-out;
          }

          .animate-fade-in-up {
            animation: fade-in-up 0.6s ease-out;
          }

          .animate-bounce-in {
            animation: bounce-in 0.8s ease-out;
          }

          .animate-fade-in {
            animation: fade-in 0.6s ease-out;
          }
        `}</style>
      </div>
    )
  );
};

export default ViewResources;