import PropTypes from "prop-types";
import { MapPin, Clock } from "lucide-react";

const INCIDENT_DATA = [
  {
    id: "inc-1",
    priority: "High",
    trainNumber: "22512",
    trainName: "Karmabhoomi Express",
    coach: "S3",
    time: "14:32",
    location: "Bhopal Junction",
    status: "Emergency Response",
  },
  {
    id: "inc-2",
    priority: "High",
    trainNumber: "12512",
    trainName: "Guwahati Express",
    coach: "B7",
    time: "14:18",
    location: "Nagpur",
    status: "Chain Pulled",
  },
  {
    id: "inc-3",
    priority: "Medium",
    trainNumber: "12605",
    trainName: "KSR Bengaluru Express",
    coach: "A2",
    time: "13:55",
    location: "Chennai Central",
    status: "Under Review",
  },
  {
    id: "inc-4",
    priority: "Medium",
    trainNumber: "12834",
    trainName: "Howrah Express",
    coach: "S1",
    time: "13:41",
    location: "Howrah",
    status: "Medical Assistance",
  },
  {
    id: "inc-5",
    priority: "Low",
    trainNumber: "11013",
    trainName: "Coimbatore Express",
    coach: "D4",
    time: "13:22",
    location: "Coimbatore",
    status: "Resolved",
  },
];

const priorityStyles = {
  High: "border-red-300 bg-red-50 text-red-700",
  Medium: "border-amber-300 bg-amber-50 text-amber-700",
  Low: "border-blue-300 bg-blue-50 text-blue-700",
};

const IncidentItem = ({
  priority,
  trainNumber,
  trainName,
  coach,
  time,
  location,
  status,
}) => (
  <article className="rounded-lg border border-gray-200 bg-white p-4">
    <div className="mb-3 flex items-center justify-between gap-2">
      <span
        className={`inline-flex rounded-md border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${priorityStyles[priority]}`}
      >
        {priority} Priority
      </span>
      <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500">
        <Clock className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
        {time}
      </span>
    </div>

    <div className="space-y-2">
      <p className="text-sm font-semibold leading-snug text-gray-900">
        {trainNumber} · {trainName}
      </p>
      <p className="text-xs text-gray-600">
        Coach {coach} · {status}
      </p>
      <p className="inline-flex items-center gap-1.5 text-xs text-gray-500">
        <MapPin className="h-3.5 w-3.5 shrink-0" strokeWidth={2} aria-hidden="true" />
        {location}
      </p>
    </div>

    <button
      type="button"
      className="mt-4 w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-50"
    >
      View Details
    </button>
  </article>
);

IncidentItem.propTypes = {
  priority: PropTypes.oneOf(["High", "Medium", "Low"]).isRequired,
  trainNumber: PropTypes.string.isRequired,
  trainName: PropTypes.string.isRequired,
  coach: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
};

const ActiveIncidentPanel = ({ className = "" }) => {
  return (
    <section
      className={`rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 ${className}`}
    >
      <header className="mb-4 border-b border-gray-100 pb-4">
        <h2 className="text-lg font-semibold tracking-tight text-gray-900 sm:text-xl">
          Active Incidents
        </h2>
      </header>

      <div className="h-[500px] overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-4">
        <div className="space-y-3">
          {INCIDENT_DATA.map((incident) => (
            <IncidentItem key={incident.id} {...incident} />
          ))}
        </div>
      </div>
    </section>
  );
};

ActiveIncidentPanel.propTypes = {
  className: PropTypes.string,
};

export default ActiveIncidentPanel;
