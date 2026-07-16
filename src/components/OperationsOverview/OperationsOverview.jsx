import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import axios from "axios";

import {
  AlertTriangle,
  CalendarDays,
  TrainFront,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";

const DEFAULT_KPI_DATA = [
  {
    id: "today-chain-pulls",
    label: "Today's Chain Pulls",
    value: "--",
    icon: AlertTriangle,
    iconBg: "bg-red-50",
    iconColor: "text-railway-red",
    trend: { direction: "neutral", text: "Loading..." },
    lastUpdated: "Live",
  },
  {
    id: "weekly-chain-pulls",
    label: "Weekly Chain Pulls",
    value: "--",
    icon: CalendarDays,
    iconBg: "bg-orange-50",
    iconColor: "text-railway-warning",
    trend: { direction: "neutral", text: "Loading..." },
    lastUpdated: "Live",
  },
  {
    id: "active-trains",
    label: "Active Trains",
    value: "--",
    icon: TrainFront,
    iconBg: "bg-blue-50",
    iconColor: "text-railway-blue",
    trend: { direction: "neutral", text: "Loading..." },
    lastUpdated: "Live",
  },
  {
    id: "response-time",
    label: "Emergency Response",
    value: "--",
    icon: Clock,
    iconBg: "bg-green-50",
    iconColor: "text-railway-success",
    trend: { direction: "neutral", text: "Loading..." },
    lastUpdated: "Live",
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
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
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
  const [kpiData, setKpiData] = useState(DEFAULT_KPI_DATA);


  const isCompact = variant === "compact";
  const isDashboard = variant === "dashboard";

  useEffect(() => {
  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/coach/dashboard-stats`
      );
  



      const stats = response.data.data;

      setKpiData([
        {
          id: "today-chain-pulls",
          label: "Today's Chain Pulls",
          value: stats.todayChainPulls,
          icon: AlertTriangle,
          iconBg: "bg-red-50",
          iconColor: "text-railway-red",
          trend: {
            direction: "neutral",
            text: "Updated Live",
          },
          lastUpdated: "Live",
        },
        {
          id: "weekly-chain-pulls",
          label: "Weekly Chain Pulls",
          value: stats.weeklyChainPulls,
          icon: CalendarDays,
          iconBg: "bg-orange-50",
          iconColor: "text-railway-warning",
          trend: {
            direction: "neutral",
            text: "Last 7 Days",
          },
          lastUpdated: "Live",
        },
        {
          id: "active-trains",
          label: "Active Trains",
          value: stats.activeTrains,
          icon: TrainFront,
          iconBg: "bg-blue-50",
          iconColor: "text-railway-blue",
          trend: {
            direction: "neutral",
            text: "Currently Running",
          },
          lastUpdated: "Live",
        },
        {
          id: "response-time",
          label: "Average Response Time",
          value: stats.averageResponseTime,
          icon: Clock,
          iconBg: "bg-green-50",
          iconColor: "text-railway-success",
          trend: {
            direction: "neutral",
            text: "Average Time",
          },
          lastUpdated: "Live",
        },
      ]);
    } catch (error) {
      console.error(error);
    }
  };

  fetchDashboardStats();
}, []);
  return (
    <section
      className={`rounded-lg border border-railway-border bg-white ${
        isDashboard ? "p-3" : isCompact ? "p-4" : "p-6 sm:p-8"
      } ${className}`}
    >
      {!isDashboard && !isCompact && (
        <header className="mb-6 border-b border-railway-border pb-4">
          <h1 className="text-2xl font-semibold tracking-tight text-red-600 sm:text-3xl">
            TESTING OPERATIONS OVERVIEW
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
        {kpiData.map((kpi) => (
        <KpiCard
          key={kpi.id}
          {...kpi}
          compact={isCompact}
          dashboard={isDashboard}
        />
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
