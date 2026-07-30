import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OperationsOverview from "../OperationsOverview/OperationsOverview";
import LiveMap from "../LiveMap/LiveMap";
import ChainPullStatusTable from "./ChainPullStatusTable";
import ImportantAuthoritiesPanel from "./ImportantAuthoritiesPanel";

function Body() {
  const [chainAlerts, setChainAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAllIncidentsModal, setShowAllIncidentsModal] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const navigate = useNavigate();

  const fetchChainAlerts = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/coach/active-chain-pulls`
      );
      const data = await response.json();
      if (response.ok) {
        if (data.alerts) {
          setChainAlerts(data.alerts);
          setLastUpdated(new Date());
        }
      } else {
        console.error("API Error:", data.message);
      }
    } catch (error) {
      console.error("Error fetching chain alerts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDismissAlert = (alertToDismiss) => {
    setChainAlerts((currentAlerts) =>
      currentAlerts.filter((alert) => alert._id !== alertToDismiss._id)
    );
  };

  useEffect(() => {
    fetchChainAlerts();
    const interval = setInterval(fetchChainAlerts, 10000);
    return () => clearInterval(interval);
  }, []);

  const formatAlertDate = (isoString) => {
    if (!isoString) return "—";
    return new Date(isoString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatAlertTime = (isoString) => {
    if (!isoString) return "—";
    return new Date(isoString).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const handleOpenIncident = (alert) => {
    navigate(`/coach-details/${alert.train_Number}/${alert.coach_uid}`);
  };

  const acpAlerts = chainAlerts.filter(
    (alert) => alert.event_type === "ACP"
  );

  const fsdsAlerts = chainAlerts.filter(
    (alert) => alert.event_type === "FSDS"
  )
  return (
    <>
      <div className="bg-railway-bg">
        <div className="mx-auto max-w-7xl px-4 py-4 lg:px-6">
          <div className="grid gap-4">
            {/* Row 1 */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[45fr_55fr]">              
              <ChainPullStatusTable
                title="Live ACP Alerts"
                headerColor="bg-red-700"
                emptyMessage="No Active ACP Alerts"
                alerts={acpAlerts}
                loading={loading}
                lastUpdated={lastUpdated}
                onViewDetails={handleOpenIncident}
                onViewMore={() => setShowAllIncidentsModal(true)}
              />

                <ImportantAuthoritiesPanel />

            </div>
            
            {/* Row 2 */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <OperationsOverview variant="dashboard" />

              <ChainPullStatusTable
                title="Live FSDS Alerts"
                headerColor="bg-blue-700"
                emptyMessage="No Active FSDS Alerts"
                alerts={fsdsAlerts}
                loading={loading}
                lastUpdated={lastUpdated}
                onViewDetails={handleOpenIncident}
                onViewMore={() => setShowAllIncidentsModal(true)}
              />
            </div>

            {/* Row 3 */}

            <LiveMap mapHeight={560} />
          </div>
        </div>
      </div>

      {showAllIncidentsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="flex max-h-[80vh] w-full max-w-5xl flex-col overflow-hidden rounded-lg border border-railway-border bg-white">
            <div className="flex items-center justify-between border-b border-railway-border bg-railway-navy px-5 py-3 text-white">
              <h3 className="text-base font-semibold">All Active Chain Pull Alerts</h3>
              <button
                type="button"
                onClick={() => setShowAllIncidentsModal(false)}
                className="rounded p-1 transition-colors hover:bg-railway-blue"
                aria-label="Close"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            <div className="overflow-y-auto">
              <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-2 bg-railway-bg px-4 py-2 text-xs font-semibold text-railway-navy">
                <span>Train Name</span>
                <span>Train Number</span>
                <span>Coach</span>
                <span>Date</span>
                <span>Time</span>
                <span>Action</span>
              </div>
              {chainAlerts.map((alert, index) => (
                <div
                  key={alert._id || index}
                  className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] items-center gap-2 border-b border-railway-border px-4 py-3 text-sm"
                >
                  <span className="truncate font-medium text-railway-text">
                    {alert.train_Name || "—"}
                  </span>
                  <span className="truncate text-railway-text/80">
                    {alert.train_Number || "—"}
                  </span>
                  <span className="truncate text-railway-text/80">
                    {alert.coach_name || alert.coach_uid || "—"}
                  </span>
                  <span className="truncate text-railway-text/80">
                    {formatAlertDate(alert.createdAt)}
                  </span>
                  <span className="truncate text-railway-text/80">
                    {formatAlertTime(alert.createdAt)}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenIncident(alert)}
                      className="rounded border border-railway-border px-2 py-1 text-xs font-semibold text-railway-blue hover:bg-railway-bg"
                    >
                      View Details
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDismissAlert(alert)}
                      className="text-xs text-railway-text/40 hover:text-railway-red"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Body;
