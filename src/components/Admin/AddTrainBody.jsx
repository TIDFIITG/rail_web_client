// AddTrainBody.jsx
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { IoArrowBack, IoTrainOutline, IoLocationOutline, IoBusinessOutline, IoTicketOutline, IoAdd, IoTrash } from "react-icons/io5";

const API_BASE = "https://rail-web-server-r7z1.onrender.com";

const emptyTrain = {
  division: "",
  states: "",
  cities: "",
  train_Name: "",
  train_Number: ""
};

const AddTrainBody = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const transferredCoach = location.state?.coach || null;
  const fromDivision = location.state?.fromDivision || null;
  const isTransfer = !!transferredCoach;

  const isEdit = useMemo(() => searchParams.get("edit") === "1" || searchParams.get("edit") === "true", [searchParams]);
  const editId = useMemo(() => searchParams.get("id") || location?.state?.train?._id || null, [searchParams, location?.state]);

  const [trainData, setTrainData] = useState(() => {
    if (isEdit && location.state?.train) {
      const t = location.state.train;
      return {
        division: t.division || "",
        states: t.states || "",
        cities: t.cities || "",
        train_Name: t.train_Name || "",
        train_Number: t.train_Number || ""
      };
    }
    return { ...emptyTrain };
  });

  // Coach rows [{ uid: "101", coach_name: "Coach A" }, ...]
  const [coaches, setCoaches] = useState(() => {
    if (isEdit && location.state?.train?.coach_uid && Array.isArray(location.state.train.coach_uid)) {
      return location.state.train.coach_uid.map((c) => ({ uid: String(c.uid || "").trim(), coach_name: String(c.coach_name || "").trim() }));
    }
    return [{ uid: "", coach_name: "" }];
  });


  useEffect(() => {
    if (transferredCoach) {
        setCoaches([
            {
                uid: transferredCoach.uid,
                coach_name: transferredCoach.coach_name
            }
        ]);
    }
}, [transferredCoach]);


  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const token = sessionStorage.getItem("token");
  const divisions = ["NFR", "ER", "WR", "SER", "SR", "NWR"];

  // If editing but state was not passed, you could fetch here (optional)
  // We'll keep it simple to avoid changing routes; your AdminBody passes state.
  useEffect(() => {
    if (isEdit && !location.state?.train) {
      // Optional fetch-by-id if needed (uncomment if your route exists)
      // axios.get(`${API_BASE}/api/division/get-division/${editId}`).then(...)
    }
  }, [isEdit, editId, location.state]);

  const handleChange = (e) => {
    setTrainData((p) => ({ ...p, [e.target.name]: e.target.value }));
    if (message) setMessage("");
  };

  const addCoachRow = () => setCoaches((rows) => [...rows, { uid: "", coach_name: "" }]);

  const removeCoachRow = (idx) => {
    setCoaches((rows) => {
      if (rows.length <= 1) return rows; // keep at least one row visible
      return rows.filter((_, i) => i !== idx);
    });
  };

  const updateCoachField = (idx, field, value) => {
    setCoaches((rows) => rows.map((r, i) => (i === idx ? { ...r, [field]: value } : r)));
    if (message) setMessage("");
  };

  const validateCoaches = () => {
    const cleaned = coaches
      .map((c) => ({ uid: String(c.uid || "").trim(), coach_name: String(c.coach_name || "").trim() }))
      .filter((c) => c.uid !== "" || c.coach_name !== ""); // drop totally empty rows

    if (cleaned.length === 0) return { ok: false, msg: "⚠️ Please add at least one coach." };

    // numeric uid & non-empty name
    for (let i = 0; i < cleaned.length; i++) {
      const c = cleaned[i];
      if (!/^\d+$/.test(c.uid)) return { ok: false, msg: `⚠️ Coach UID at row ${i + 1} must be numeric.` };
      if (!c.coach_name) return { ok: false, msg: `⚠️ Coach name at row ${i + 1} cannot be empty.` };
    }

    // duplicates
    const ids = cleaned.map((c) => c.uid);
    const uniq = new Set(ids);
    if (uniq.size !== ids.length) return { ok: false, msg: "⚠️ Duplicate coach UIDs are not allowed." };

    return { ok: true, data: cleaned };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // field validation
    const required = ["division", "states", "cities", "train_Name", "train_Number"];
    for (const k of required) {
      if (!trainData[k]) {
        setMessage("⚠️ All fields are required!");
        setIsLoading(false);
        return;
      }
    }

    if (!token) {
      setMessage("⚠️ Authentication failed! Please log in again.");
      setIsLoading(false);
      return;
    }

    // coaches validation
    const val = validateCoaches();
    if (!val.ok) {
      setMessage(val.msg);
      setIsLoading(false);
      return;
    }

    const payload = {
      division: trainData.division,
      states: trainData.states,
      cities: trainData.cities,
      train_Name: trainData.train_Name,
      train_Number: trainData.train_Number,
      coach_uid: val.data // array of { uid, coach_name }
    };

    try {
      if (isEdit && editId) {
        // MODIFY
        const res = await axios.put(`${API_BASE}/api/division/modify-division/${editId}`, payload, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
        });
        setMessage("✅ Train updated successfully!");
      } else {
        // ADD
        const res = await axios.post(`${API_BASE}/api/division/add-division`, payload, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
        });
  
        if (transferredCoach && fromDivision) {
        await axios.delete(
          `${API_BASE}/api/division/division/${fromDivision._id}/remove-coach/${transferredCoach.uid}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
        setMessage("✅ Train added successfully!");
      }

      if (!isEdit) {
        // reset only on add
        setTrainData({ ...emptyTrain });
        setCoaches([{ uid: "", coach_name: "" }]);
      }

      setTimeout(() => navigate("/admin-dashboard"), 1200);
    } catch (error) {
      console.error("🚨 Error:", error);
      if (error.response) {
        setMessage(`❌ ${error.response.data.message || "Operation failed. Try again."}`);
      } else if (error.request) {
        setMessage("❌ No response from the server. Please try again.");
      } else {
        setMessage("❌ Unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Back */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/admin-dashboard")}
            className="group flex items-center text-gray-600 hover:text-indigo-600 text-lg font-medium transition-all duration-200 ease-in-out transform hover:scale-105"
          >
            <IoArrowBack className="mr-2 transition-transform duration-200 group-hover:-translate-x-1" size={24} />
            Back to Admin Dashboard
          </button>
        </div>

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl p-8 border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mb-4">
              <IoTrainOutline className="text-white text-2xl" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {isEdit
                ? "Edit Train"
                : isTransfer
                ? "Transfer Coach to New Train"
                : "Add New Train"}
            </h1>
            <p className="text-gray-600">
              {isEdit
                ? "Update the details of this train"
                : isTransfer
                ? "Create a new train. The selected coach will be transferred automatically."
                : "Fill in the details to add a new train to the system"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {isTransfer && (
            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
              <h3 className="mb-4 flex items-center text-lg font-bold text-blue-800">
                🔄 Coach Being Transferred
              </h3>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Coach Name</p>
                  <p className="font-semibold text-black">{transferredCoach.coach_name}</p>
                </div>

                <div>
                  <p className="text-gray-500">Coach UID</p>
                  <p className="font-semibold text-black ">{transferredCoach.uid}</p>
                </div>

                <div>
                  <p className="text-gray-500">From Train</p>
                  <p className="font-semibold text-black">{fromDivision.train_Name}</p>
                </div>

                <div>
                  <p className="text-gray-500">Train Number</p>
                  <p className="font-semibold text-black">{fromDivision.train_Number}</p>
                </div>
              </div>
            </div>
          )}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Division */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <IoBusinessOutline className="mr-2 text-indigo-500" />
                  Division
                </label>
                <div className="relative">
                  <select
                    name="division"
                    value={trainData.division}
                    onChange={handleChange}
                    className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 appearance-none cursor-pointer hover:border-gray-300"
                    required
                  >
                    <option value="" disabled>Select Division</option>
                    {divisions.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* State */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <IoLocationOutline className="mr-2 text-indigo-500" />
                  State
                </label>
                <input
                  type="text"
                  name="states"
                  placeholder="Enter state name"
                  value={trainData.states}
                  onChange={handleChange}
                  className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 placeholder-gray-400 hover:border-gray-300"
                  required
                />
              </div>

              {/* City */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <IoLocationOutline className="mr-2 text-indigo-500" />
                  City
                </label>
                <input
                  type="text"
                  name="cities"
                  placeholder="Enter city name"
                  value={trainData.cities}
                  onChange={handleChange}
                  className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 placeholder-gray-400 hover:border-gray-300"
                  required
                />
              </div>

              {/* Train Name */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <IoTrainOutline className="mr-2 text-indigo-500" />
                  Train Name
                </label>
                <input
                  type="text"
                  name="train_Name"
                  placeholder="Enter train name"
                  value={trainData.train_Name}
                  onChange={handleChange}
                  className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 placeholder-gray-400 hover:border-gray-300"
                  required
                />
              </div>
            </div>

            {/* Train Number */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <IoTicketOutline className="mr-2 text-indigo-500" />
                Train Number
              </label>
              <input
                type="text"
                name="train_Number"
                placeholder="Enter train number"
                value={trainData.train_Number}
                onChange={handleChange}
                className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 placeholder-gray-400 hover:border-gray-300"
                required
              />
            </div>

            {/* Coaches */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-700">Coaches (UID & Name)</label>
                {!transferredCoach && (
                  <button
                    type="button"
                    onClick={addCoachRow}
                    className="inline-flex items-center space-x-2 px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
                  >
                    <IoAdd />
                    <span>Add Coach</span>
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {coaches.map((c, idx) => (
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center bg-gray-50 p-3 rounded-xl border">
                    <div className="md:col-span-2">
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="UID (numbers only)"
                        value={c.uid}
                        onChange={(e) => updateCoachField(idx, "uid", e.target.value)}
                        readOnly={!!transferredCoach}
                        disabled={!!transferredCoach}
                        className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-2 text-gray-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 placeholder-gray-400 hover:border-gray-300"
                      />
                    </div>
                    <div className="md:col-span-3">
                      <input
                        type="text"
                        placeholder="Coach name"
                        value={c.coach_name}
                        onChange={(e) => updateCoachField(idx, "coach_name", e.target.value)}
                        readOnly={!!transferredCoach}
                        disabled={!!transferredCoach}
                        className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-2 text-gray-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 placeholder-gray-400 hover:border-gray-300"
                      />
                    </div>
                    <div className="md:col-span-5 flex justify-end">
                      {!transferredCoach && (
                      <button
                        type="button"
                        onClick={() => removeCoachRow(idx)}
                        className="inline-flex items-center space-x-1 px-3 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition disabled:opacity-50"
                        disabled={coaches.length <= 1}
                        title={coaches.length <= 1 ? "At least one row is required" : "Remove this coach"}
                      >
                        <IoTrash />
                        <span>Remove</span>
                      </button>
                    )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-3"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>{isEdit ? "Updating Train..." : "Adding Train..."}</span>
                  </>
                ) : (
                  <>
                    <IoTrainOutline className="text-xl" />
                    <span>{isEdit ? "Update Train" : "Add Train"}</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Message */}
          {message && (
            <div
              className={`mt-6 p-4 rounded-xl text-center font-medium ${
                message.includes("✅")
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {message}
            </div>
          )}
        </div>

        {/* Notes */}
        <div className="mt-8 bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Important Notes</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Ensure all information is accurate before submitting</li>
                <li>• Train numbers should be unique across the system</li>
                <li>• Division codes: NFR, ER, WR, SER, SR, NWR</li>
                <li>• Add at least one coach (UID must be numeric, no duplicates)</li>
                <li>• Contact support if you encounter any issues</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-indigo-500 border-t-transparent"></div>
            <span className="text-gray-700 font-medium">Processing...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddTrainBody;