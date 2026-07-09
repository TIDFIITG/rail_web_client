import PropTypes from "prop-types";
import {
  AlertTriangle,
  Siren,
  TrainFront,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";

const KPI_DATA = [
  {
    id: "incidents",
    label: "Today's Incidents",
    value: "18",
    icon: AlertTriangle,
    iconBg: "bg-orange-50",
    iconColor: "text-railway-warning",
    trend: { direction: "up", text: "+3 from yesterday" },
    lastUpdated: "17:42 IST",
  },
  {
    id: "trains",
    label: "Running Trains",
    value: "237",
    icon: TrainFront,
    iconBg: "bg-blue-50",
    iconColor: "text-railway-blue",
    trend: { direction: "up", text: "+12 on schedule" },
    lastUpdated: "17:42 IST",
  },
  {
    id: "emergencies",
    label: "Active Emergencies",
    value: "4",
    icon: Siren,
    iconBg: "bg-red-50",
    iconColor: "text-railway-red",
    trend: { direction: "down", text: "-1 in last hour" },
    lastUpdated: "17:42 IST",
  },
  {
    id: "response-time",
    label: "Average Response Time",
    value: "3.8 min",
    icon: Clock,
    iconBg: "bg-green-50",
    iconColor: "text-railway-success",
    trend: { direction: "neutral", text: "Within SLA target" },
    lastUpdated: "17:42 IST",
  },
];

const trendStyles = {
  up: {
    container: "text-railway-success bg-green-50",
    Icon: TrendingUp,
  },
  down: {
    container: "text-railway-red bg-red-50",
    Icon: TrendingDown,
  },
  neutral: {
    container: "text-railway-text/70 bg-railway-bg",
    Icon: Minus,
  },
};

const KpiCard = ({
  label,
  value,
  icon: Icon,
  iconBg,
  iconColor,
  trend,
  lastUpdated,
  compact = false,
  dashboard = false,
}) => {
  const { container, Icon: TrendIcon } = trendStyles[trend.direction];

  if (dashboard) {
    return (
      <article className="rounded-lg border border-railway-border bg-white p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-2xl font-bold tracking-tight text-railway-navy lg:text-3xl">
              {value}
            </p>
            <p className="mt-1 text-xs font-semibold text-railway-text">{label}</p>
            <p className="mt-0.5 text-[10px] text-railway-text/50">
              Last Updated: {lastUpdated}
            </p>
          </div>
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconBg}`}
          >
            <Icon className={`h-5 w-5 ${iconColor}`} strokeWidth={2.25} aria-hidden="true" />
          </div>
        </div>
        <div className="mt-2">
          <span
            className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium ${container}`}
          >
            <TrendIcon className="h-3 w-3" strokeWidth={2.25} aria-hidden="true" />
            {trend.text}
          </span>
        </div>
      </article>
    );
  }

  return (
    <article
      className={`rounded-lg border border-railway-border bg-white ${compact ? "p-3" : "p-6"}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p
            className={`font-bold tracking-tight text-railway-navy ${compact ? "text-2xl" : "text-4xl sm:text-5xl"}`}
          >
            {value}
          </p>
          <p
            className={`font-semibold text-railway-text ${compact ? "mt-1 text-xs" : "mt-2 text-sm"}`}
          >
            {label}
          </p>
          {!compact && (
            <p className="mt-1 text-xs text-railway-text/50">Last Updated: {lastUpdated}</p>
          )}
        </div>
        <div
          className={`flex shrink-0 items-center justify-center rounded-lg ${iconBg} ${compact ? "h-9 w-9" : "h-12 w-12"}`}
        >
          <Icon
            className={`${iconColor} ${compact ? "h-5 w-5" : "h-7 w-7"}`}
            strokeWidth={2.25}
            aria-hidden="true"
          />
        </div>
      </div>
      {!compact && (
        <div className="mt-5">
          <span
            className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium ${container}`}
          >
            <TrendIcon className="h-3.5 w-3.5" strokeWidth={2.25} aria-hidden="true" />
            {trend.text}
          </span>
        </div>
      )}
    </article>
  );
};

KpiCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  iconBg: PropTypes.string.isRequired,
  iconColor: PropTypes.string.isRequired,
  trend: PropTypes.shape({
    direction: PropTypes.oneOf(["up", "down", "neutral"]).isRequired,
    text: PropTypes.string.isRequired,
  }).isRequired,
  lastUpdated: PropTypes.string.isRequired,
  compact: PropTypes.bool,
  dashboard: PropTypes.bool,
};

const OperationsOverview = ({ className = "", variant = "default" }) => {
  const isCompact = variant === "compact";
  const isDashboard = variant === "dashboard";

  return (
    <section
      className={`rounded-lg border border-railway-border bg-white ${
        isDashboard ? "p-3" : isCompact ? "p-4" : "p-6 sm:p-8"
      } ${className}`}
    >
      {!isDashboard && !isCompact && (
        <header className="mb-6 border-b border-railway-border pb-4">
          <h1 className="text-2xl font-semibold tracking-tight text-railway-navy sm:text-3xl">
            Rail Watch
          </h1>
          <p className="mt-1 text-sm text-railway-text/70">
            Real-Time Railway Emergency Monitoring Platform
          </p>
        </header>
      )}

      <div
        className={
          isDashboard
            ? "grid grid-cols-2 gap-3 lg:grid-cols-4"
            : isCompact
              ? "grid grid-cols-2 gap-3"
              : "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        }
      >
        {KPI_DATA.map((kpi) => (
          <KpiCard key={kpi.id} {...kpi} compact={isCompact} dashboard={isDashboard} />
        ))}
      </div>
    </section>
  );
};

OperationsOverview.propTypes = {
  className: PropTypes.string,
  variant: PropTypes.oneOf(["default", "compact", "dashboard"]),
};

export default OperationsOverview;
