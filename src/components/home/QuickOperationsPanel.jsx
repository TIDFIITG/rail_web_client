import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
  Plus,
  Siren,
  Mail,
  BarChart3,
  Users,
  Settings,
} from "lucide-react";

const OPERATIONS = [
  {
    id: "add-train",
    title: "Add Train",
    icon: Plus,
    to: "/add-train",
  },
  {
    id: "incidents",
    title: "Active Incidents",
    icon: Siren,
    to: null,
    action: "incidents",
  },
  {
    id: "email",
    title: "Send Email",
    icon: Mail,
    to: "/admin-dashboard",
  },
  {
    id: "reports",
    title: "Reports",
    icon: BarChart3,
    to: "/dashboard",
  },
  {
    id: "users",
    title: "User Management",
    icon: Users,
    to: "/admin-dashboard",
  },
  {
    id: "settings",
    title: "Settings",
    icon: Settings,
    to: "/profile",
  },
];

const OperationCard = ({ title, icon: Icon, to, onAction, action }) => {
  const className =
    "flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white p-3 text-center transition-colors hover:border-blue-700 hover:bg-blue-50";

  const content = (
    <>
      <Icon className="mb-2 h-5 w-5 text-blue-700" strokeWidth={2} />
      <span className="text-xs font-semibold text-slate-800">{title}</span>
    </>
  );

  if (to) {
    return (
      <Link to={to} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={() => onAction?.(action)} className={className}>
      {content}
    </button>
  );
};

OperationCard.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  to: PropTypes.string,
  onAction: PropTypes.func,
  action: PropTypes.string,
};

const QuickOperationsPanel = ({ onAction, className = "" }) => {
  return (
    <section
      className={`flex h-[170px] flex-col rounded-lg border border-gray-200 bg-white p-3 ${className}`}
    >
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-700">
        Quick Operations
      </h2>
      <div className="grid grid-cols-3 grid-rows-2 gap-2">
        {OPERATIONS.map((op) => (
          <OperationCard key={op.id} {...op} onAction={onAction} />
        ))}
      </div>
    </section>
  );
};

QuickOperationsPanel.propTypes = {
  onAction: PropTypes.func,
  className: PropTypes.string,
};

export default QuickOperationsPanel;
