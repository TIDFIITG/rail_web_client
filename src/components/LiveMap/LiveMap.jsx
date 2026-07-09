import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const INDIA_CENTER = [20.5937, 78.9629];
const INDIA_ZOOM = 5;

const MARKER_DATA = [
  {
    id: "12512",
    trainName: "Guwahati Express",
    trainNumber: "12512",
    coach: "S5",
    latitude: 21.1458,
    longitude: 79.0882,
    status: "On Schedule",
    isEmergency: false,
  },
  {
    id: "12605",
    trainName: "KSR Bengaluru Express",
    trainNumber: "12605",
    coach: "A2",
    latitude: 13.0827,
    longitude: 80.2707,
    status: "On Schedule",
    isEmergency: false,
  },
  {
    id: "22512",
    trainName: "Karmabhoomi Express",
    trainNumber: "22512",
    coach: "S3",
    latitude: 23.2599,
    longitude: 77.4126,
    status: "Emergency",
    isEmergency: true,
  },
];

const createMarkerIcon = (isEmergency) =>
  L.divIcon({
    className: "",
    html: `<div style="
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: ${isEmergency ? "#D32F2F" : "#0B4F8C"};
      border: 2px solid #ffffff;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.35);
    "></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    popupAnchor: [0, -8],
  });

const MapPopup = ({ trainName, trainNumber, coach, latitude, longitude, status, isEmergency }) => (
  <div className="min-w-[200px] space-y-2 p-1">
    <p className="text-sm font-semibold text-gray-900">{trainName}</p>
    <dl className="space-y-1 text-xs text-gray-600">
      <div className="flex justify-between gap-4">
        <dt className="font-medium text-gray-500">Train Number</dt>
        <dd className="font-semibold text-gray-900">{trainNumber}</dd>
      </div>
      <div className="flex justify-between gap-4">
        <dt className="font-medium text-gray-500">Coach</dt>
        <dd className="font-semibold text-gray-900">{coach}</dd>
      </div>
      <div className="flex justify-between gap-4">
        <dt className="font-medium text-gray-500">Latitude</dt>
        <dd className="font-semibold text-gray-900">{latitude.toFixed(4)}</dd>
      </div>
      <div className="flex justify-between gap-4">
        <dt className="font-medium text-gray-500">Longitude</dt>
        <dd className="font-semibold text-gray-900">{longitude.toFixed(4)}</dd>
      </div>
      <div className="flex justify-between gap-4">
        <dt className="font-medium text-gray-500">Status</dt>
        <dd
          className={`font-semibold ${
            isEmergency ? "text-railway-red" : "text-railway-success"
          }`}
        >
          {status}
        </dd>
      </div>
    </dl>
  </div>
);

MapPopup.propTypes = {
  trainName: PropTypes.string.isRequired,
  trainNumber: PropTypes.string.isRequired,
  coach: PropTypes.string.isRequired,
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired,
  status: PropTypes.string.isRequired,
  isEmergency: PropTypes.bool.isRequired,
};

const LiveMap = ({ className = "", mapHeight = 560 }) => {
  const [syncTime, setSyncTime] = useState("");

  useEffect(() => {
    const updateSyncTime = () => {
      setSyncTime(
        new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone: "Asia/Kolkata",
        }) + " IST"
      );
    };
    updateSyncTime();
    const timer = setInterval(updateSyncTime, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      className={`rounded-lg border border-railway-border bg-white p-4 ${className}`}
    >
      <header className="mb-3 border-b border-railway-border pb-3">
        <h2 className="text-base font-semibold tracking-tight text-railway-navy">
          Live Railway Operations Map
        </h2>
        <p className="mt-0.5 text-xs font-medium text-railway-text/60">
          Last synchronized: {syncTime || "—"}
        </p>
      </header>

      <div
        className="w-full overflow-hidden rounded-lg border border-railway-border"
        style={{ height: `${mapHeight}px` }}
      >
        <MapContainer
          center={INDIA_CENTER}
          zoom={INDIA_ZOOM}
          className="h-full w-full"
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {MARKER_DATA.map((marker) => (
            <Marker
              key={marker.id}
              position={[marker.latitude, marker.longitude]}
              icon={createMarkerIcon(marker.isEmergency)}
            >
              <Popup>
                <MapPopup {...marker} />
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <footer className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-railway-border pt-3 text-xs font-medium text-railway-text/70">
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden="true">🟢</span>
          Running Trains
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden="true">🔴</span>
          Active Emergencies
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden="true">🟡</span>
          Delayed Trains
        </span>
      </footer>
    </section>
  );
};

LiveMap.propTypes = {
  className: PropTypes.string,
  mapHeight: PropTypes.number,
};

export default LiveMap;
