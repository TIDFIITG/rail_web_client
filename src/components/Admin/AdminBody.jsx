// AdminBody.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
    IoTrainOutline,
    IoPersonOutline,
    IoAddCircleOutline,
    IoRefreshOutline,
    IoMailOutline,
    IoTrashOutline,
    IoStatsChartOutline,
    IoLogOutOutline,
    IoSettingsOutline,
    IoEyeOutline,
    IoTicketOutline,
    IoSendOutline,
    IoCloseOutline,
    IoCheckmarkOutline,
    IoPencilOutline,
    IoTimeOutline // <-- NEW: Import IoTimeOutline for activity log
} from "react-icons/io5";

const AdminBody = () => {
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const [trains, setTrains] = useState([]);
    const [users, setUsers] = useState([]);
    const [recentActivities, setRecentActivities] = useState([]); // State for recent activities
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [emailData, setEmailData] = useState({
        subject: '',
        message: '',
        email: '', // Empty for all users, specific email for individual user
        recipientType: 'all' // 'all' or 'specific'
    });

    // Helper to set message and clear it after a delay
    const displayMessage = (msg) => {
        setMessage(msg);
        setTimeout(() => {
            setMessage("");
        }, 5000); // Clear message after 5 seconds
    };

    // Fetch all trains
    const getAllTrains = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get("https://rail-web-server-r7z1.onrender.com/api/division/get-all-division");
            setTrains(Array.isArray(response.data.data) ? response.data.data : []);
            displayMessage("✅ Fetched all trains successfully!");
        } catch (error) {
            console.error("Error fetching trains:", error);
            displayMessage("❌ Failed to fetch trains.");
            setTrains([]); // Ensure trains is an empty array on error
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch all users (still commented out, as per previous discussions if backend endpoint isn't ready)
    /*
    const getAllUsers = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get("https://rail-web-server-r7z1.onrender.com/api/admin/get-all-users");
            setUsers(Array.isArray(response.data.users) ? response.data.users : []);
            displayMessage("✅ Fetched all users successfully!");
        } catch (error) {
            console.error("Error fetching users:", error);
            displayMessage("❌ Failed to fetch users.");
            setUsers([]);
        } finally {
            setIsLoading(false);
        }
    };
    */

    // NEW: Fetch Recent Activities and map backend response to frontend structure
    const getRecentActivities = async () => {
        setIsLoading(true);
        try {
            const token = sessionStorage.getItem("token");
            if (!token) {
                displayMessage("⚠️ Authentication failed! Please log in again.");
                setIsLoading(false);
                return;
            }
            const response = await axios.get("https://rail-web-server-r7z1.onrender.com/api/activities/recent", {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // --- CRITICAL FIX: Map backend data to frontend's expected structure ---
            const mappedActivities = Array.isArray(response.data.data) ? response.data.data.map(activity => ({
                _id: activity._id,
                action: activity.type || 'N/A', // Map 'type' to 'action', default to 'N/A' if null/undefined
                description: activity.message || 'No description provided.', // Map 'message' to 'description'
                timestamp: activity.timestamp,
                userId: activity.user, // 'user' from backend JSON
                username: activity.username || '', // 'username' might not be in backend JSON, default to empty string
                details: activity.details || null // Include details if available
            })) : [];

            setRecentActivities(mappedActivities);
            displayMessage("✅ Fetched recent activities successfully!");
        } catch (error) {
            console.error("Error fetching recent activities:", error);
            displayMessage("❌ Failed to fetch recent activities.");
            setRecentActivities([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Delete a train
    const deleteTrain = async (trainId) => {
        if (!window.confirm("Are you sure you want to delete this train?")) return;

        setIsLoading(true);
        try {
            const token = sessionStorage.getItem("token"); // Assuming token is needed for admin actions

            if (!token) {
                displayMessage("⚠️ Authentication failed! Please log in again.");
                setIsLoading(false);
                return;
            }

            await axios.delete(`https://rail-web-server-r7z1.onrender.com/api/division/delete-division/${trainId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            displayMessage("✅ Train deleted successfully!");
            getAllTrains(); // Refresh train list after deletion
        } catch (error) {
            console.error("Error deleting train:", error);
            if (error.response) {
                displayMessage(`❌ Failed to delete train: ${error.response.data.message || 'Server error'}.`);
            } else {
                displayMessage("❌ Failed to delete train. Network error or unexpected issue.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    // NEW: Modify/Edit train function
    const modifyTrain = (train) => {
        // Navigate to add-train page with edit mode and pass train data
        navigate("/add-train?edit=1&id=" + train._id, {
            state: { train: train }
        });
    };

    // Send email to users
    const sendEmail = async () => {
        console.log("DEBUG: sendEmail function called.");

        if (!emailData.subject || !emailData.message) {
            displayMessage("❌ Please fill in both subject and message fields.");
            console.log("DEBUG: Validation failed - subject or message missing.");
            return;
        }

        if (emailData.recipientType === 'specific' && !emailData.email) {
            displayMessage("❌ Please enter a recipient email address.");
            console.log("DEBUG: Validation failed - specific recipient email missing.");
            return;
        }

        setIsLoading(true);
        console.log("DEBUG: isLoading set to true.");

        try {
            const token = sessionStorage.getItem("token");
            console.log("DEBUG: Retrieved token from sessionStorage.");

            if (!token) {
                displayMessage("⚠️ Authentication failed! Please log in again.");
                setIsLoading(false);
                console.log("DEBUG: Token is missing, aborting email send.");
                return;
            }

            const payload = {
                subject: emailData.subject,
                message: emailData.message,
                ...(emailData.recipientType === 'specific' && { email: emailData.email })
            };
            console.log("DEBUG: Prepared payload:", JSON.stringify(payload));
            console.log("DEBUG: Attempting axios.post to /admin/send-mail...");

            const response = await axios.post(
                "https://rail-web-server-r7z1.onrender.com/api/auth/admin/send-mail",
                payload,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log("DEBUG: axios.post successful. Response data:", response.data);
            displayMessage(`✅ Email request sent successfully! Check your email service provider logs for delivery status.`);
            setShowEmailModal(false);
            setEmailData({
                subject: '',
                message: '',
                email: '',
                recipientType: 'all'
            });
            console.log("DEBUG: Email modal closed and form reset.");

        } catch (error) {
            console.log("DEBUG: axios.post caught an error.");
            console.error("DEBUG: Error sending email:", error);
            if (error.response) {
                console.log("DEBUG: Error response data:", error.response.data);
                console.log("DEBUG: Error response status:", error.response.status);
                displayMessage(`❌ Failed to send email: ${error.response.data.message || 'Server error'}.`);
            } else if (error.request) {
                console.log("DEBUG: No response received from server (network error).");
                displayMessage("❌ No response from server. Check network connection.");
            } else {
                console.log("DEBUG: Other error details:", error.message);
                displayMessage("❌ An unexpected error occurred while sending email.");
            }
        } finally {
            setIsLoading(false);
            console.log("DEBUG: isLoading set to false. sendEmail function finished.");
        }
    };

    // Open email modal
    const openEmailModal = (recipientEmail = null) => {
        setEmailData({
            subject: '',
            message: '',
            email: recipientEmail || '',
            recipientType: recipientEmail ? 'specific' : 'all'
        });
        setShowEmailModal(true);
        console.log("DEBUG: Email modal opened.");
    };

    // Load initial data on component mount
    useEffect(() => {
        getAllTrains();
        getRecentActivities(); // Fetch activities on mount
        // getAllUsers(); // Still commented out as backend endpoint is not ready
    }, []);

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to logout?")) {
            sessionStorage.removeItem("token");
            navigate("/login");
        }
    };

    // Helper function to format an ISO date string into a more readable local date/time format
    const formatActivityDate = (isoDateString) => {
        try {
            const date = new Date(isoDateString);
            const options = {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            };
            return date.toLocaleString(undefined, options);
        } catch (e) {
            console.error("Error formatting date:", e);
            return isoDateString; // Return original string if formatting fails
        }
    };

    // Reusable StatCard component
    const StatCard = ({ title, value, icon: Icon, color, bgColor }) => (
        <div className={`${bgColor} rounded-2xl p-6 shadow-lg border border-white/20`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
                </div>
                <div className={`p-3 rounded-full ${color}`}>
                    <Icon className="text-xl text-white" />
                </div>
            </div>
        </div>
    );

    // Reusable TabButton component
    const TabButton = ({ id, label, icon: Icon, active, onClick, disabled = false }) => (
        <button
            onClick={() => onClick(id)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                active
                    ? 'bg-white text-indigo-600 shadow-md'
                    : 'text-gray-600 hover:text-indigo-600 hover:bg-white/50'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={disabled}
        >
            <Icon className="text-lg" />
            <span>{label}</span>
        </button>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-white/20">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl">
                                <IoTrainOutline className="text-white text-2xl" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
                                <p className="text-gray-600">Railway Management System</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-red-600 transition-colors"
                            >
                                <IoLogOutOutline className="text-lg" />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <StatCard
                        title="Total Trains"
                        value={(trains || []).length}
                        icon={IoTrainOutline}
                        color="bg-gradient-to-r from-blue-500 to-blue-600"
                        bgColor="bg-blue-50"
                    />
                    <StatCard
                        title="Total Users"
                        value={(users || []).length}
                        icon={IoPersonOutline}
                        color="bg-gradient-to-r from-green-500 to-green-600"
                        bgColor="bg-green-50"
                    />
                    <StatCard
                        title="System Status"
                        value="Online"
                        icon={IoStatsChartOutline}
                        color="bg-gradient-to-r from-purple-500 to-purple-600"
                        bgColor="bg-purple-50"
                    />
                </div>

                {/* Navigation Tabs */}
                <div className="bg-gray-100 rounded-2xl p-2 mb-8">
                    <div className="flex space-x-2 overflow-x-auto">
                        <TabButton
                            id="overview"
                            label="Overview"
                            icon={IoStatsChartOutline}
                            active={activeTab === 'overview'}
                            onClick={setActiveTab}
                        />
                        <TabButton
                            id="trains"
                            label="Train Management"
                            icon={IoTrainOutline}
                            active={activeTab === 'trains'}
                            onClick={setActiveTab}
                            disabled={false}
                        />
                        <TabButton
                            id="users"
                            label="User Management"
                            icon={IoPersonOutline}
                            active={activeTab === 'users'}
                            onClick={setActiveTab}
                        />
                        {/* Tab button for Recent Activities */}
                        <TabButton
                            id="activities"
                            label="Recent Activities"
                            icon={IoTimeOutline}
                            active={activeTab === 'activities'}
                            onClick={setActiveTab}
                        />
                    </div>
                </div>

                {/* Tab Content */}
                <div className="space-y-6">
                    {/* Overview Tab Content */}
                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                                    <IoTrainOutline className="mr-2 text-indigo-500" />
                                    Quick Actions
                                </h3>
                                <div className="space-y-3">
                                    <button
                                        onClick={() => navigate("/add-train")}
                                        className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-xl font-medium hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
                                    >
                                        <IoAddCircleOutline className="text-lg" />
                                        <span>Add New Train</span>
                                    </button>
                                    <button
                                        onClick={() => openEmailModal()}
                                        disabled={isLoading}
                                        className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-medium hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50"
                                    >
                                        <IoMailOutline className="text-lg" />
                                        <span>Send Email</span>
                                    </button>
                                </div>
                            </div>

                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                                    <IoTimeOutline className="mr-2 text-indigo-500" />
                                    Recent Activity
                                </h3>
                                <div className="space-y-3 text-sm text-gray-600 max-h-60 overflow-y-auto custom-scrollbar">
                                    {(recentActivities || []).length === 0 ? (
                                        <div className="text-center py-4 text-gray-500">
                                            <p>No recent activities found.</p>
                                        </div>
                                    ) : (
                                        (recentActivities || []).map((activity) => (
                                            <div key={activity._id} className="flex items-start space-x-2">
                                                <div className="w-2 h-2 mt-1 bg-blue-500 rounded-full flex-shrink-0"></div>
                                                <p className="flex-grow">
                                                    {/* Display action and description, ensuring they exist */}
                                                    {activity.action && <span className="font-medium text-gray-800">{activity.action}:</span>}
                                                    {activity.description && ` ${activity.description}`}
                                                    <span className="text-xs text-gray-500 ml-2">
                                                        ({formatActivityDate(activity.timestamp)})
                                                    </span>
                                                </p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Train Management Tab Content */}
                    {activeTab === 'trains' && (
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                                    <IoTrainOutline className="mr-2 text-indigo-500" />
                                    Train Management
                                </h3>
                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => navigate("/add-train")}
                                        className="flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-xl font-medium hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
                                    >
                                        <IoAddCircleOutline className="text-lg" />
                                        <span>Add Train</span>
                                    </button>
                                    <button
                                        onClick={getAllTrains}
                                        disabled={isLoading}
                                        className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-xl font-medium hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50"
                                    >
                                        <IoRefreshOutline className={`text-lg ${isLoading ? 'animate-spin' : ''}`} />
                                        <span>Refresh</span>
                                    </button>
                                </div>
                            </div>

                            {/* Train List */}
                            <div className="space-y-4">
                                {(trains || []).length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        <IoTrainOutline className="mx-auto text-4xl mb-2" />
                                        <p>No trains found. Add a new train to get started!</p>
                                    </div>
                                ) : (
                                    (trains || []).map((train) => (
                                        <div key={train._id} className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow">
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-4 flex-wrap">
                                                        <div className="flex items-center space-x-2 mr-4">
                                                            <IoTrainOutline className="text-indigo-500" />
                                                            <span className="font-semibold text-gray-800">{train.train_Name}</span>
                                                        </div>
                                                        <div className="flex items-center space-x-2 mr-4">
                                                            <IoTicketOutline className="text-purple-500" />
                                                            <span className="text-gray-600">#{train.train_Number}</span>
                                                        </div>
                                                        <div className="flex items-center space-x-2 mr-4 text-sm text-gray-500">
                                                            <span>Zone: {train.division}</span>
                                                        </div>
                                                        <div className="flex items-center space-x-2 mr-4 text-sm text-blue-600">
                                                            <span>Coaches: {train.coach_uid ? train.coach_uid.length : 0}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    {/* Modify Train Button - NOW ENABLED */}
                                                    <button
                                                        onClick={() => modifyTrain(train)}
                                                        disabled={isLoading}
                                                        className="flex items-center space-x-1 bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50"
                                                    >
                                                        <IoPencilOutline className="text-sm" />
                                                        <span className="text-sm">Modify</span>
                                                    </button>
                                                    {/* Delete Train Button */}
                                                    <button
                                                        onClick={() => deleteTrain(train._id)}
                                                        disabled={isLoading}
                                                        className="flex items-center space-x-1 bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                                                    >
                                                        <IoTrashOutline className="text-sm" />
                                                        <span className="text-sm">Delete</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {/* User Management Tab Content */}
                    {activeTab === 'users' && (
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                                    <IoPersonOutline className="mr-2 text-indigo-500" />
                                    User Management
                                </h3>
                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => {
                                            // Call getAllUsers() here when the backend is ready.
                                            // For now, it remains a placeholder.
                                            displayMessage("User fetching is not yet implemented.");
                                        }}
                                        disabled={isLoading}
                                        className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl font-medium hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50"
                                    >
                                        <IoRefreshOutline className={`text-lg ${isLoading ? 'animate-spin' : ''}`} />
                                        <span>Refresh Users</span>
                                    </button>
                                    <button
                                        onClick={() => openEmailModal()}
                                        disabled={isLoading}
                                        className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-xl font-medium hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50"
                                    >
                                        <IoMailOutline className="text-lg" />
                                        <span>Send Email</span>
                                    </button>
                                </div>
                            </div>

                            {/* User List */}
                            <div className="space-y-4">
                                {(users || []).length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        <IoPersonOutline className="mx-auto text-4xl mb-2" />
                                        <p>No users found (Backend endpoint for users is not ready)</p>
                                    </div>
                                ) : (
                                    (users || []).map((user) => (
                                        <div key={user.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                                                        <IoPersonOutline className="text-white" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-800">{user.email}</p>
                                                        <p className="text-sm text-gray-600">Role: {user.role}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => openEmailModal(user.email)}
                                                        className="flex items-center space-x-1 bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors"
                                                    >
                                                        <IoMailOutline className="text-sm" />
                                                        <span className="text-sm">Email</span>
                                                    </button>
                                                    {/* Update User Button (Coming Soon) */}
                                                    <button
                                                        onClick={() => displayMessage("Update user features coming soon!")}
                                                        className="flex items-center space-x-1 bg-yellow-500 text-white px-3 py-1 rounded-lg opacity-50 cursor-not-allowed"
                                                        disabled
                                                    >
                                                        <IoPencilOutline className="text-sm" />
                                                        <span className="text-sm">Update (Soon)</span>
                                                    </button>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                        user.role === 'admin'
                                                            ? 'bg-purple-100 text-purple-800'
                                                            : 'bg-green-100 text-green-800'
                                                    }`}>
                                                        {user.role}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {/* NEW: Recent Activities Tab Content */}
                    {activeTab === 'activities' && (
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                                    <IoTimeOutline className="mr-2 text-indigo-500" />
                                    Recent Activities
                                </h3>
                                <button
                                    onClick={getRecentActivities}
                                    disabled={isLoading}
                                    className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-xl font-medium hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50"
                                >
                                    <IoRefreshOutline className={`text-lg ${isLoading ? 'animate-spin' : ''}`} />
                                    <span>Refresh Activities</span>
                                </button>
                            </div>

                            {/* Activity List */}
                            <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                                {(recentActivities || []).length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        <IoTimeOutline className="mx-auto text-4xl mb-2" />
                                        <p>No recent activities found.</p>
                                    </div>
                                ) : (
                                    (recentActivities || []).map((activity) => (
                                        <div key={activity._id} className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow">
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    {/* Display action and description, ensuring they exist */}
                                                    <p className="font-semibold text-gray-800">
                                                        {activity.action && <span>{activity.action}: </span>}
                                                        {activity.description}
                                                        {/* Conditionally display user info if available */}
                                                        <span className="ml-2 text-sm font-normal text-gray-600">
                                                            (User: {activity.userId ? activity.userId : 'N/A'})
                                                        </span>
                                                    </p>
                                                    {/* Display the formatted timestamp */}
                                                    <p className="text-xs text-gray-500 mt-2">
                                                        Timestamp: {formatActivityDate(activity.timestamp)}
                                                    </p>
                                                    {/* Conditionally display details if available */}
                                                    {activity.details && (
                                                        <pre className="mt-2 p-2 bg-gray-100 rounded-md text-xs text-gray-700 whitespace-pre-wrap break-all">
                                                            Details: {JSON.stringify(activity.details, null, 2)}
                                                        </pre>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                    {/* END NEW: Recent Activities Tab Content */}
                </div>

                {/* Email Modal */}
                {showEmailModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4 shadow-2xl">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                                    <IoMailOutline className="mr-2 text-indigo-500" />
                                    Send Email
                                </h3>
                                <button
                                    onClick={() => {
                                        setShowEmailModal(false);
                                        console.log("DEBUG: Email modal closed by user.");
                                    }}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <IoCloseOutline className="text-xl text-gray-600" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                {/* Recipient Type */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Send to:
                                    </label>
                                    <div className="flex space-x-4">
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="recipientType"
                                                value="all"
                                                checked={emailData.recipientType === 'all'}
                                                onChange={(e) => {
                                                    setEmailData({ ...emailData, recipientType: e.target.value, email: '' });
                                                    console.log("DEBUG: Recipient type changed to all.");
                                                }}
                                                className="mr-2"
                                            />
                                            All Users
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="recipientType"
                                                value="specific"
                                                checked={emailData.recipientType === 'specific'}
                                                onChange={(e) => {
                                                    setEmailData({ ...emailData, recipientType: e.target.value });
                                                    console.log("DEBUG: Recipient type changed to specific.");
                                                }}
                                                className="mr-2"
                                            />
                                            Specific User
                                        </label>
                                    </div>
                                </div>

                                {/* Email Field (for specific user) */}
                                {emailData.recipientType === 'specific' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Recipient Email:
                                        </label>
                                        <input
                                            type="email"
                                            value={emailData.email}
                                            onChange={(e) => setEmailData({ ...emailData, email: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
                                            placeholder="Enter recipient's email address"
                                        />
                                    </div>
                                )}

                                {/* Subject Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Subject:
                                    </label>
                                    <input
                                        type="text"
                                        value={emailData.subject}
                                        onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
                                        placeholder="Enter email subject"
                                    />
                                </div>

                                {/* Message Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Message:
                                    </label>
                                    <textarea
                                        value={emailData.message}
                                        onChange={(e) => setEmailData({ ...emailData, message: e.target.value })}
                                        rows={6}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 "
                                        placeholder="Enter your message here..."
                                    />
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-end space-x-3 pt-4 border-t">
                                    <button
                                        onClick={() => {
                                            setShowEmailModal(false);
                                            console.log("DEBUG: Email modal cancelled by user.");
                                        }}
                                        className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={sendEmail}
                                        disabled={isLoading}
                                        className="flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50"
                                    >
                                        <IoSendOutline className="text-lg" />
                                        <span>Send Email</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Success/Error Message */}
                {message && (
                    <div className={`fixed top-4 right-4 p-4 rounded-xl shadow-lg border font-medium z-50 ${
                        message.includes("✅")
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-red-50 text-red-700 border-red-200"
                    }`}>
                        {message}
                    </div>
                )}

                {/* Loading Overlay */}
                {isLoading && (
                    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl p-6 flex items-center space-x-3">
                            <div className="animate-spin rounded-full h-6 w-6 border-2 border-indigo-500 border-t-transparent"></div>
                            <span className="text-gray-700 font-medium">Processing...</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminBody;