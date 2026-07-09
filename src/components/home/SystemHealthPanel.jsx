import PropTypes from "prop-types";
import { Activity, Database, Server, Wifi } from "lucide-react";

const HEALTH_ITEMS = [
  { id: "api", label: "API Services", status: "Operational", icon: Server },
  { id: "db", label: "Database", status: "Operational", icon: Database },
  { id: "monitor", label: "Chain Monitoring", status: "Operational", icon: Activity },
  { id: "network", label: "Network Link", status: "Operational", icon: Wifi },
];

const SystemHealthPanel = ({ className = "" }) => {
  return (
    <section
      className={`rounded-lg border border-gray-200 bg-white p-4 ${className}`}
    >
      <h2 className="mb-3 text-sm font-semibold text-slate-800">
        System Health
      </h2>
      <ul className="space-y-2">
        {HEALTH_ITEMS.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between rounded border border-gray-100 bg-gray-50 px-3 py-2"
          >
            <div className="flex items-center gap-2">
              <item.icon className="h-4 w-4 text-blue-700" strokeWidth={2} />
              <span className="text-xs font-medium text-gray-700">
                {item.label}
              </span>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-green-700">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              {item.status}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
};

SystemHealthPanel.propTypes = {
  className: PropTypes.string,
};

export default SystemHealthPanel;
