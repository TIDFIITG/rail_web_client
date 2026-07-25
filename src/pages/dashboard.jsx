import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import axios from "axios";

const Icon = {
  Train: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
      <rect x="4" y="3" width="16" height="13" rx="4" />
      <path d="M4 11h16" />
      <path d="M8 19l-2 2M16 19l2 2" />
      <circle cx="8.5" cy="14.5" r="0.5" fill="currentColor" />
      <circle cx="15.5" cy="14.5" r="0.5" fill="currentColor" />
    </svg>
  ),
  Building: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
      <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  Pin: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
      <path d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
      <circle cx="12" cy="11" r="3" />
    </svg>
  ),
  Search: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  ),
  Globe: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a15 15 0 010 18 15 15 0 010-18z" />
    </svg>
  ),
  Moon: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  ),
  Sun: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  ),
  Accessibility: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
      <circle cx="12" cy="4" r="1.6" fill="currentColor" stroke="none" />
      <path d="M5 8h14M12 8v13M8 21l4-6 4 6M9 12l3-1 3 1" />
    </svg>
  ),
  Mail: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  ),
  Github: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M12 2a10 10 0 00-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.36 1.09 2.93.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.95 0-1.1.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.4 9.4 0 015 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.69 0 3.85-2.34 4.7-4.57 4.94.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0012 2z" />
    </svg>
  ),
  Linkedin: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M6.94 5a2 2 0 11-4-.02 2 2 0 014 .02zM3.3 8.98h3.6V21H3.3V8.98zM9.6 8.98h3.46v1.64h.05c.48-.9 1.66-1.85 3.42-1.85 3.66 0 4.34 2.4 4.34 5.53V21h-3.6v-5.98c0-1.43-.03-3.26-1.99-3.26-2 0-2.3 1.56-2.3 3.16V21H9.6V8.98z" />
    </svg>
  ),
  Twitter: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M22 5.9c-.7.3-1.5.6-2.3.7.8-.5 1.5-1.3 1.8-2.3-.8.5-1.7.8-2.6 1a4.1 4.1 0 00-7 3.7A11.6 11.6 0 013 4.9a4.1 4.1 0 001.3 5.5c-.6 0-1.2-.2-1.8-.5v.1c0 2 1.4 3.6 3.3 4a4.2 4.2 0 01-1.9.1 4.1 4.1 0 003.9 2.9A8.3 8.3 0 012 18.6a11.6 11.6 0 006.3 1.9c7.5 0 11.7-6.3 11.7-11.7v-.5c.8-.6 1.5-1.3 2-2.1z" />
    </svg>
  ),
  LogOut: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
      <path d="M16 17l5-5-5-5M21 12H9" />
    </svg>
  ),
};

/* ------------------------------------------------------------------ */
/*  Static organisation strip shown under the utility bar              */
/* ------------------------------------------------------------------ */
const ORGANISATIONS = [
  { code: "IR", name: "Indian Railways", bg: "bg-rose-100", text: "text-rose-600" },
  { code: "NFR", name: "North East Frontier Railway", bg: "bg-emerald-100", text: "text-emerald-600" },
  { code: "IIT", name: "IIT Guwahati", bg: "bg-amber-100", text: "text-amber-600" },
  { code: "TIH", name: "Technology Innovation Hub", bg: "bg-blue-100", text: "text-blue-600" },
];

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Dashboard", to: "/dashboard" },
  { label: "Contact Us", to: "/contact-us" },
  { label: "Profile", to: "/profile" },
  { label: "Admin Dashboard", to: "/admin-dashboard" },
];

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [stats, setStats] = useState({
    totalTrains: 0,
    totalDivisions: 0,
    totalStates: 0,
    totalCities: 0,
  });
  const [now, setNow] = useState(new Date());
  const [lastSync, setLastSync] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Live clock for the utility bar
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fmtDate = (d) =>
    d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "Asia/Kolkata" });
  const fmtTime = (d) =>
    `${d.toLocaleTimeString("en-GB", { hour12: false, timeZone: "Asia/Kolkata" })} IST`;
  const fmtDay = (d) => d.toLocaleDateString("en-US", { weekday: "long", timeZone: "Asia/Kolkata" });

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
  const calculateStats = (rows) => {
    const uniqueDivisions = new Set(rows.map((item) => item.division)).size;
    const uniqueStates = new Set(rows.map((item) => item.state)).size;
    const uniqueCities = new Set(rows.map((item) => item.cities)).size;

    setStats({
      totalTrains: rows.length,
      totalDivisions: uniqueDivisions,
      totalStates: uniqueStates,
      totalCities: uniqueCities,
    });
  };

  // Fetch all resources if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            "https://rail-web-server-r7z1.onrender.com/api/division/get-all-division",
            { headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` } }
          );
          const formattedData = response.data.data.map((item) => ({
            ...item,
            trainName: item.train_Name || "",
            trainNumber: item.train_Number || "",
            division: item.division || "",
            state: item.states || "",
            cities: item.cities || "",
          }));
          setData(formattedData);
          setFilteredData(formattedData);
          calculateStats(formattedData);
          setLastSync(new Date());
        } catch (error) {
          console.error("Error fetching all resources:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [isAuthenticated]);

  // Filter data based on search term
  useEffect(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const filtered = data.filter((item) => {
      return (
        item.trainName?.toLowerCase().includes(lowerSearchTerm) ||
        item.trainNumber?.toString().includes(lowerSearchTerm) ||
        item.division?.toLowerCase().includes(lowerSearchTerm) ||
        item.state?.toLowerCase().includes(lowerSearchTerm) ||
        item.cities?.toLowerCase().includes(lowerSearchTerm)
      );
    });
    setFilteredData(filtered);
  }, [searchTerm, data]);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    navigate("/login");
  };

  const toggleDarkMode = () => {
    setDarkMode((v) => !v);
    document.documentElement.classList.toggle("dark");
  };

  if (!isAuthenticated) {
    return null;
  }

  const STAT_CARDS = [
    { label: "Total Trains", value: stats.totalTrains, icon: Icon.Train, bg: "bg-blue-100", text: "text-blue-600" },
    { label: "Divisions", value: stats.totalDivisions, icon: Icon.Building, bg: "bg-emerald-100", text: "text-emerald-600" },
    { label: "States", value: stats.totalStates, icon: Icon.Pin, bg: "bg-purple-100", text: "text-purple-600" },
    { label: "Cities", value: stats.totalCities, icon: Icon.Building, bg: "bg-orange-100", text: "text-orange-600" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      {/* ---------------------------------------------------------- */}
      {/* Main content                                                 */}
      {/* ---------------------------------------------------------- */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-10">
        {/* Page header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900">Railway Dashboard</h1>
            <p className="text-slate-500 mt-1 max-w-xl">
              Monitor and manage railway operations with real-time insights and comprehensive train management.
            </p>
          </div>
          <div className="text-right text-sm">
            <p className="text-slate-500">
              Last synchronized: <span className="font-medium text-slate-700">{lastSync ? fmtTime(lastSync) : "—"}</span>
            </p>
            <p className="flex items-center justify-end gap-1.5 text-emerald-600 font-medium mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Live feed active
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {STAT_CARDS.map((card) => (
            <div key={card.label} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <p className="text-xs font-semibold text-slate-500 tracking-wide uppercase">{card.label}</p>
                <span className={`w-9 h-9 rounded-lg flex items-center justify-center ${card.bg} ${card.text}`}>
                  <card.icon className="w-5 h-5" />
                </span>
              </div>
              <p className="text-3xl font-bold text-slate-900 mb-2">{card.value}</p>
              <p className="flex items-center gap-1.5 text-xs text-slate-500">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Updated live
              </p>
            </div>
          ))}
        </div>

        {/* Registered trains panel */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-[#122A52] px-6 py-4 flex items-center justify-between">
            <h2 className="text-white font-semibold">Registered Trains</h2>
            <span className="text-slate-300 text-sm">
              Showing {filteredData.length} of {data.length}
            </span>
          </div>

          <div className="px-6 py-4 border-b border-slate-100">
            <div className="relative max-w-xl">
              <Icon.Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search trains by name, number, division, state, or city..."
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="relative mb-6">
                  <div className="w-14 h-14 border-4 border-indigo-100 rounded-full animate-spin mx-auto" />
                  <div
                    className="w-14 h-14 border-4 border-indigo-600 rounded-full animate-spin absolute top-0 left-1/2 -translate-x-1/2"
                    style={{ borderRightColor: "transparent", animationDirection: "reverse", animationDuration: "1.2s" }}
                  />
                </div>
                <p className="text-slate-500">Fetching railway data...</p>
              </div>
            </div>
          ) : filteredData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    <th className="px-6 py-3">Train Name</th>
                    <th className="px-6 py-3">Train Number</th>
                    <th className="px-6 py-3">Division</th>
                    <th className="px-6 py-3">State</th>
                    <th className="px-6 py-3">City</th>
                    <th className="px-6 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item, i) => (
                    <tr key={item._id || i} className="border-t border-slate-100 hover:bg-slate-50/60">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                            <Icon.Train className="w-4 h-4" />
                          </span>
                          <span className="font-semibold text-slate-900">{item.trainName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-500">{item.trainNumber}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                          {item.division}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500">{item.state}</td>
                      <td className="px-6 py-4 text-slate-500">{item.cities}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => navigate(`/division-id/${item._id}`)}
                          className="px-4 py-2 rounded-full bg-railway-blue text-white text-sm font-semibold shadow-md transition-all duration-200 hover:bg-railway-navy hover:shadow-lg hover:scale-105 active:scale-95"
                        >
                          View Details →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16 px-6">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <Icon.Train className="w-9 h-9 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">No Results Found</h3>
              <p className="text-slate-500 mb-6">
                {searchTerm
                  ? `We couldn't find any trains matching "${searchTerm}". Try adjusting your search terms.`
                  : "No train resources are currently available."}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}

          {!loading && (
            <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>{data.length} Registered Trains</span>
              <span>Last Updated: {lastSync ? fmtTime(lastSync).replace(" IST", "") + " IST" : "—"}</span>
            </div>
          )}
        </div>
      </div>

      {/* ---------------------------------------------------------- */}
      {/* Footer                                                       */}
      {/* ---------------------------------------------------------- */}
    
    </div>
  );
};

export default Dashboard;