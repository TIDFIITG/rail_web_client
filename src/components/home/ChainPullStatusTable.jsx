import PropTypes from "prop-types";

const formatDate = (isoString) => {
  if (!isoString) return "—";
  return new Date(isoString).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatTime = (isoString) => {
  if (!isoString) return "—";
  return new Date(isoString).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

const formatLastUpdated = (date) => {
  if (!date) return "—";
  return (
    date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Kolkata",
    }) + " IST"
  );
};

const ChainPullStatusTable = ({
  alerts,
  loading,
  lastUpdated,
  onViewDetails,
  onViewMore,
}) => {
  const visibleAlerts = alerts.slice(0, 5);
  const activeCount = alerts.length;

  return (
    <section className="flex min-h-[190px] flex-col overflow-hidden rounded-lg border border-railway-border bg-white shadow-sm">
      <div className="bg-railway-navy px-3 py-2">
        <h2 className="text-xs font-semibold text-white">Live Chain Pull Status</h2>
      </div>

      <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] border-b border-railway-border bg-railway-blue px-3 py-2 text-[11px] font-semibold text-white">
        <span>Train Name</span>
        <span>Train Number</span>
        <span>Coach</span>
        <span>Date</span>
        <span>Time</span>
        <span>Action</span>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden">
        {loading ? (
          <div className="flex h-full items-center justify-center py-6">
            <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-railway-blue" />
            <span className="ml-2 text-xs text-railway-text/70">Loading chain pull status...</span>
          </div>
        ) : visibleAlerts.length === 0 ? (
          <div className="flex h-full items-center justify-center px-3 py-6">
            <p className="text-xs font-medium text-railway-success">
              All Systems Normal — No Active Chain Pulls
            </p>
          </div>
        ) : (
          visibleAlerts.map((alert, index) => (
            <div
              key={alert._id || index}
              className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] items-center gap-2 border-b border-railway-border bg-white px-3 py-2 text-xs text-railway-text last:border-b-0 even:bg-railway-bg/50"
            >
              <span className="truncate font-medium">{alert.train_Name || "—"}</span>
              <span className="truncate">{alert.train_Number || "—"}</span>
              <span className="truncate">{alert.coach_name || alert.coach_uid || "—"}</span>
              <span className="truncate">{formatDate(alert.createdAt)}</span>
              <span className="truncate">{formatTime(alert.createdAt)}</span>
              <button
                type="button"
                onClick={() => onViewDetails(alert)}
                className="whitespace-nowrap rounded border border-railway-border px-2 py-0.5 text-[11px] font-semibold text-railway-blue hover:border-railway-blue hover:bg-railway-bg"
              >
                View Details
              </button>
            </div>
          ))
        )}
      </div>

      <div className="flex shrink-0 items-center justify-between border-t border-railway-border bg-railway-bg px-3 py-2 text-[11px]">
        <span className="font-semibold text-railway-navy">
          {activeCount} Total Active Alert{activeCount !== 1 ? "s" : ""}
        </span>
        <span className="text-railway-text/60">
          Last Updated: {formatLastUpdated(lastUpdated)}
        </span>
        <button
          type="button"
          onClick={onViewMore}
          className="font-semibold text-railway-blue hover:text-railway-navy disabled:invisible"
          disabled={activeCount === 0}
        >
          View More →
        </button>
      </div>
    </section>
  );
};

ChainPullStatusTable.propTypes = {
  alerts: PropTypes.arrayOf(PropTypes.object).isRequired,
  loading: PropTypes.bool.isRequired,
  lastUpdated: PropTypes.instanceOf(Date),
  onViewDetails: PropTypes.func.isRequired,
  onViewMore: PropTypes.func.isRequired,
};

export default ChainPullStatusTable;
