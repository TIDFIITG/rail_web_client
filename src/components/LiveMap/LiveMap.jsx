import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";

const INDIA_CENTER = [22.9734, 78.6569];
const INDIA_ZOOM = 5;



const createMarkerIcon = () =>
  L.divIcon({
    className: "",
    html: `
      <div style="
        width:8px;
        height:8px;
        border-radius:50%;
        background:#D32F2F;
        border:1px solid white;
      "></div>
    `,
    iconSize: [8, 8],
    iconAnchor: [4, 4],
    popupAnchor: [0, -4],
  });

const MapPopup = ({
  trainName,
  trainNumber,
  coach,
  latitude,
  longitude,
  status,
  isEmergency,
}) => (
  <div className="min-w-[220px] space-y-2">
    <h3 className="border-b pb-2 text-base font-semibold text-railway-navy">
      {trainName}
    </h3>

    <div className="space-y-1 text-sm">
      <div className="flex justify-between">
        <span className="text-gray-500">Train No.</span>
        <span className="font-semibold">{trainNumber}</span>
      </div>

      <div className="flex justify-between">
        <span className="text-gray-500">Coach</span>
        <span className="font-semibold">{coach}</span>
      </div>

      <div className="flex justify-between">
        <span className="text-gray-500">Latitude</span>
        <span>{Number(latitude).toFixed(4)}</span>
      </div>

      <div className="flex justify-between">
        <span className="text-gray-500">Longitude</span>
        <span>{Number(longitude).toFixed(4)}</span>
      </div>

      <div className="flex justify-between">
        <span className="text-gray-500">Status</span>

        <span
          className={`font-semibold ${
            isEmergency
              ? "text-railway-red"
              : "text-railway-success"
          }`}
        >
          {status}
        </span>
      </div>
    </div>
  </div>
);

MapPopup.propTypes = {
  trainName: PropTypes.string.isRequired,
  trainNumber: PropTypes.string.isRequired,
  coach: PropTypes.string.isRequired,
  latitude: PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.number,
  ]).isRequired,

  longitude: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  status: PropTypes.string.isRequired,
  isEmergency: PropTypes.bool.isRequired,
};

const LiveMap = ({ className = "", mapHeight = 560 }) => {
  const [syncTime, setSyncTime] = useState("");
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    const fetchMarkers = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/coach/recent-chain-status`
        );

        setMarkers(response.data.alerts);

        setSyncTime(
          new Date().toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
            timeZone: "Asia/Kolkata",
          }) + " IST"
        );
      } catch (error) {
        console.error("Failed to fetch map markers:", error);
      }
    };

    fetchMarkers();

    const interval = setInterval(fetchMarkers, 20000);

    return () => clearInterval(interval);
  }, []);
  return (
    <section
      className={`rounded-lg border border-railway-border bg-white shadow-sm ${className}`}
    >
      <header className="border-b border-railway-border px-5 py-4">
        <h2 className="text-lg font-semibold text-railway-navy">
          Live Railway Operations Map
        </h2>

        <p className="mt-1 text-xs text-gray-500">
          Last synchronized: {syncTime}
        </p>
      </header>

      <div
        className="overflow-hidden"
        style={{ height: `${mapHeight}px` }}
      >
        <MapContainer
          center={INDIA_CENTER}
          zoom={INDIA_ZOOM}
          scrollWheelZoom
          className="h-full w-full"
        >
        <TileLayer
          attribution='&copy; MapTiler &copy; OpenStreetMap contributors'
          url={`https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${import.meta.env.VITE_MAPTILER_KEY}`}
        />

         {markers.map((marker) => (
          <Marker
            key={marker._id}
            position={[
              Number(marker.latitude),
              Number(marker.longitude),
            ]}
            icon={createMarkerIcon()}
          >
            <Popup>
              <MapPopup
                trainName={marker.train_Name}
                trainNumber={marker.train_Number}
                coach={marker.coach_name}
                latitude={marker.latitude}
                longitude={marker.longitude}
                status="Chain Pulled"
                isEmergency={true}
              />
            </Popup>
          </Marker>
        ))}
        </MapContainer>
      </div>

      <footer className="flex flex-wrap items-center gap-6 border-t border-railway-border px-5 py-3 text-sm">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-blue-600"></span>
          <span>Running Trains</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-red-600"></span>
          <span>Active Emergencies</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-yellow-400"></span>
          <span>Delayed Trains</span>
        </div>
      </footer>
    </section>
  );
};

LiveMap.propTypes = {
  className: PropTypes.string,
  mapHeight: PropTypes.number,
};

export default LiveMap;