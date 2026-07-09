import { useEffect, useState } from "react";
import PropTypes from "prop-types";

const PLACEHOLDER_ACTIVITIES = [
  { id: "1", time: "18:27", label: "Train Added" },
  { id: "2", time: "18:20", label: "Emergency Triggered" },
  { id: "3", time: "18:11", label: "Coach Updated" },
  { id: "4", time: "17:56", label: "Email Notification Sent" },
];

const formatActivityTime = (timestamp) => {
  if (!timestamp) return "—";
  return new Date(timestamp).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Kolkata",
  });
};

const RecentActivityPanel = ({ className = "" }) => {
  const [activities, setActivities] = useState(PLACEHOLDER_ACTIVITIES);
  const [usingPlaceholder, setUsingPlaceholder] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/activities/recent`,
          { headers }
        );
        const data = await response.json();

        if (response.ok && Array.isArray(data.data) && data.data.length > 0) {
          setActivities(
            data.data.slice(0, 6).map((activity) => ({
              id: activity._id,
              time: formatActivityTime(activity.timestamp),
              label: activity.message || activity.type || "System Activity",
            }))
          );
          setUsingPlaceholder(false);
        }
      } catch {
        setUsingPlaceholder(true);
      }
    };

    fetchActivities();
  }, []);

  return (
    <section
      className={`rounded-lg border border-gray-200 bg-white p-4 ${className}`}
    >
      <h2 className="mb-3 text-sm font-semibold text-slate-800">
        Recent Activity
      </h2>
      <ul className="space-y-2">
        {activities.map((activity) => (
          <li
            key={activity.id}
            className="flex items-start gap-3 border-b border-gray-100 pb-2 last:border-b-0 last:pb-0"
          >
            <span className="w-10 shrink-0 text-xs font-semibold text-blue-700">
              {activity.time}
            </span>
            <span className="text-xs text-gray-700">{activity.label}</span>
          </li>
        ))}
      </ul>
      {usingPlaceholder && (
        <p className="mt-2 text-[10px] text-gray-400">Sample activity feed</p>
      )}
    </section>
  );
};

RecentActivityPanel.propTypes = {
  className: PropTypes.string,
};

export default RecentActivityPanel;
