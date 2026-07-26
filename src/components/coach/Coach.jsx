import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../Loder";
import { IoDownloadOutline } from "react-icons/io5";
// Import only jsPDF - no autotable dependency
import { jsPDF } from 'jspdf';

import { MapPinned } from "lucide-react";

// Cache invalidation: v2.0

const CoachDetails = () => {
  const { trainNumber, coach } = useParams();
  console.log("CoachDetails component loaded.");
  console.log("Train Number from URL:", trainNumber);
  console.log("Coach UID from URL:", coach);

  const [coachData, setCoachData] = useState([]);
  const [coachInfo, setCoachInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchCoachData = async () => {
    if (!trainNumber || !coach) {
      console.warn("Missing trainNumber or coach UID parameter from URL. Cannot fetch data.");
      setLoading(false);
      setError(true);
      setErrorMessage("Missing train number or coach UID in URL parameters.");
      return;
    }

    try {
      const apiUrl = `https://rail-web-server-r7z1.onrender.com/api/coach/get-coach-data?train_Number=${trainNumber}&coach_uid=${coach}`;
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`
        }
      });

      console.log("API Response:", response.data);

      if (response.data.train?.length > 0) {
        const sortedData = response.data.train.sort((a, b) => {
          if (a.createdAt && b.createdAt) {
            return new Date(b.createdAt) - new Date(a.createdAt);
          }
          return new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.time}`);
        });

        setCoachData(sortedData);

        if (sortedData[0]) {
          setCoachInfo({
            coach_uid: sortedData[0].coach_uid,
            coach_name: sortedData[0].coach_name || `Coach ${sortedData[0].coach_uid}`,
            train_Number: sortedData[0].train_Number,
            train_Name: sortedData[0].train_Name || 'Unknown Train'
          });
        }
      } else {
        setCoachData([]);
        setErrorMessage("No data available for this coach.");
      }
    } catch (error) {
      console.error("Error fetching coach data:", error.response?.data || error.message);
      setError(true);
      setErrorMessage(
        error.response?.data?.message || "Failed to load coach data. Please check if the train number and coach UID are valid."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoachData();
    const interval = setInterval(fetchCoachData, 5000);
    return () => clearInterval(interval);
  }, [trainNumber, coach]);

  const handleDownloadPdf = () => {
    console.log("PDF download initiated.");
    if (coachData.length === 0) {
      alert("No data available to download as PDF.");
      return;
    }

    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      
      // Set margins
      const marginLeft = 10;
      const marginTop = 10;
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      let yPosition = marginTop;

      // Title
      doc.setFontSize(18);
      doc.setFont(undefined, 'bold');
      doc.text('Coach Details Report', marginLeft, yPosition);
      yPosition += 12;

      // Metadata
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.text(`Train: ${coachInfo?.train_Name || trainNumber} (${trainNumber})`, marginLeft, yPosition);
      yPosition += 6;
      doc.text(`Coach: ${coachInfo?.coach_name || 'Unknown'} (UID: ${coach})`, marginLeft, yPosition);
      yPosition += 6;
      doc.text(`Generated: ${new Date().toLocaleString()}`, marginLeft, yPosition);
      yPosition += 6;
      doc.text(`Total Records: ${coachData.length}`, marginLeft, yPosition);
      yPosition += 10;

      // Create simple table manually
      doc.setFontSize(9);
      doc.setFont(undefined, 'bold');
      
      // Table header
      const colWidths = [18, 18, 12, 15, 12, 12, 12, 10, 12, 10];
      const headers = ['Train #', 'Train Name', 'Coach UID', 'Chain', 'Latitude', 'Longitude', 'Memory', 'Map', 'Date', 'Time'];
      
      // Draw header row with background
      doc.setFillColor(75, 0, 130);
      doc.setTextColor(255, 255, 255);
      let xPos = marginLeft;
      headers.forEach((header, index) => {
        doc.rect(xPos, yPosition - 4, colWidths[index], 5, 'F');
        doc.text(header, xPos + 1, yPosition, { maxWidth: colWidths[index] - 2 });
        xPos += colWidths[index];
      });

      yPosition += 6;
      doc.setTextColor(0, 0, 0);
      doc.setFont(undefined, 'normal');
      doc.setFontSize(8);

      // Draw data rows
      coachData.forEach((data, rowIndex) => {
        // Check if we need a new page
        if (yPosition > pageHeight - 15) {
          doc.addPage();
          yPosition = marginTop;
          
          // Redraw header on new page
          doc.setFontSize(9);
          doc.setFont(undefined, 'bold');
          doc.setFillColor(75, 0, 130);
          doc.setTextColor(255, 255, 255);
          xPos = marginLeft;
          headers.forEach((header, index) => {
            doc.rect(xPos, yPosition - 4, colWidths[index], 5, 'F');
            doc.text(header, xPos + 1, yPosition, { maxWidth: colWidths[index] - 2 });
            xPos += colWidths[index];
          });
          yPosition += 6;
          doc.setTextColor(0, 0, 0);
          doc.setFont(undefined, 'normal');
          doc.setFontSize(8);
        }

        // Alternate row background
        if (rowIndex % 2 === 0) {
          let xPos = marginLeft;
          headers.forEach((_, index) => {
            doc.setFillColor(240, 240, 240);
            doc.rect(xPos, yPosition - 3, colWidths[index], 4, 'F');
            xPos += colWidths[index];
          });
        }

        const rowData = [
          String(data.train_Number || 'N/A'),
          String(data.train_Name || 'N/A').slice(0, 12),
          String(data.coach_uid || 'N/A'),
          String(data.chain_status || 'N/A'), 
          String(data.latitude ?? 'N/A').slice(0, 8),
          String(data.longitude ?? 'N/A').slice(0, 8),
          String(data.memory ?? 'N/A').slice(0, 8),
          String(data.date || 'N/A'),
          String(data.time || 'N/A'),
          `https://maps.google.com/?q=${data.latitude},${data.longitude}`
        ];

        xPos = marginLeft;
        rowData.forEach((cellData, index) => {
          doc.text(String(cellData).substring(0, 10), xPos + 1, yPosition, { 
            maxWidth: colWidths[index] - 2,
            overflow: 'ellipsis'
          });
          xPos += colWidths[index];
        });

        yPosition += 4;
      });

      // Save the PDF
      const fileName = `coach_details_${trainNumber}_${coach}_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      console.log(`PDF successfully generated: ${fileName}`);
      alert('PDF downloaded successfully!');
      
    } catch (error) {
      console.error("PDF generation error:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  const handleDownloadCsv = () => {
    console.log("CSV download initiated.");
    if (coachData.length === 0) {
      alert("No data available to download as CSV.");
      return;
    }

    const headers = [
      "Train Number",
      "Train Name",
      "Coach UID",
      "Chain Status",
      "Latitude",
      "Longitude",
      "Memory",
      "Date",
      "Time",
      "Map"
    ];

    const rows = coachData.map(data => [
      data.train_Number || "N/A",
      data.train_Name || "N/A",
      data.coach_uid || "N/A",
      data.chain_status || "N/A",
      data.latitude || "N/A",
      data.longitude || "N/A",
      data.memory || "N/A",
      data.date || "N/A",
      data.time || "N/A",
      `https://maps.google.com/?q=${data.latitude},${data.longitude}`,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `coach_details_${trainNumber}_${coach}_${new Date().toISOString().slice(0, 10)}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      console.log("CSV download completed.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
        <Loader />
        <p className="mt-6 text-white text-xl font-semibold">Loading Coach Details</p>
        <p className="mt-2 text-purple-200">Fetching real-time data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-pink-900 p-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Error Loading Data</h2>
          <p className="text-red-200 mb-6">{errorMessage}</p>
          <button
            onClick={() => {
              setError(false);
              setLoading(true);
              fetchCoachData();
            }}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Old records without event_type should be treated as ACP
  const acpData = coachData.filter(
    data => !data.event_type || data.event_type === "ACP"
  );

  const fsdsData = coachData.filter(
    data => data.event_type === "FSDS"
  );
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-6 shadow-2xl">
          <h1 className="text-4xl font-bold text-white mb-4">Coach Details Dashboard</h1>
          <div className="text-purple-200 space-y-2">
            <p className="text-lg">
              <span className="font-semibold">Train:</span> {coachInfo?.train_Name || 'Loading...'} ({trainNumber})
            </p>
            <p className="text-lg">
              <span className="font-semibold">Coach:</span> {coachInfo?.coach_name || 'Loading...'} <span className="ml-2 text-sm">UID: {coach}</span>
            </p>
            <p className="text-sm text-purple-300 mt-4">
              🔴 Live Data - Updates every 5 seconds
            </p>
          </div>
          <div className="mt-6 flex gap-4">
            <button
              onClick={handleDownloadPdf}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              <IoDownloadOutline size={20} />
              Download PDF
            </button>
            <button
              onClick={handleDownloadCsv}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              <IoDownloadOutline size={20} />
              Download CSV
            </button>
          </div>
        </div>

        {/* Data Table Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-4">🔴 ACP Alerts</h2>
            <p className="text-purple-200 mb-6">Showing {acpData.length} ACP records (latest first)</p>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-red-600/70">
                    <th className="p-4 text-white font-semibold">Latitude</th>
                    <th className="p-4 text-white font-semibold">Longitude</th>
                    <th className="p-4 text-white font-semibold">Memory</th>
                    <th className="p-4 text-white font-semibold">Date</th>
                    <th className="p-4 text-white font-semibold">Time</th>
                    <th className="p-4 text-white font-semibold">Map</th>
                  </tr>
                </thead>
                <tbody>
                  {acpData.length > 0 ? (
                    acpData.map((data, index) => (
                      <tr key={index} className="border-b border-purple-500/30 hover:bg-purple-600/20 transition-colors">
                        <td className="px-3 py-2 text-purple-100">{data.latitude || "N/A"}</td>
                        <td className="px-3 py-2 text-purple-100">{data.longitude || "N/A"}</td>
                        <td className="px-3 py-2 text-purple-100">{data.memory || "N/A"}</td>
                        <td className="px-3 py-2 text-purple-100">{data.date || "N/A"}</td>
                        <td className="px-3 py-2 text-purple-100">{data.time || "N/A"}</td>
                        <td className="px-3 py-2">
                          <button
                            onClick={() =>
                              window.open(
                                `https://www.google.com/maps?q=${data.latitude},${data.longitude}`,
                                "_blank"
                              )
                            }
                            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-all duration-300"
                            title="Open Location"
                          >
                            <MapPinned size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="10" className="p-8 text-center text-purple-200">
                        <div className="flex flex-col items-center">
                          <p className="text-xl font-semibold mb-2">No data available</p>
                          <p className="text-sm">No sensor data found for this coach.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        {/* FSDS Data Table Section */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-4">🔥 FSDS Alerts</h2>
            <p className="text-purple-200 mb-6">Showing {fsdsData.length} FSDS records (latest first)</p>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-orange-600/70">
                    <th className="p-4 text-white font-semibold">Latitude</th>
                    <th className="p-4 text-white font-semibold">Longitude</th>
                    <th className="p-4 text-white font-semibold">Memory</th>
                    <th className="p-4 text-white font-semibold">Date</th>
                    <th className="p-4 text-white font-semibold">Time</th>
                    <th className="p-4 text-white font-semibold">Map</th>
                  </tr>
                </thead>
                <tbody>
                  {fsdsData.length > 0 ? (
                    fsdsData.map((data, index) => (
                      <tr key={index} className="border-b border-purple-500/30 hover:bg-purple-600/20 transition-colors">
                        <td className="px-3 py-2 text-purple-100">{data.latitude || "N/A"}</td>
                        <td className="px-3 py-2 text-purple-100">{data.longitude || "N/A"}</td>
                        <td className="px-3 py-2 text-purple-100">{data.memory || "N/A"}</td>
                        <td className="px-3 py-2 text-purple-100">{data.date || "N/A"}</td>
                        <td className="px-3 py-2 text-purple-100">{data.time || "N/A"}</td>
                        <td className="px-3 py-2">
                          <button
                            onClick={() =>
                              window.open(
                                `https://www.google.com/maps?q=${data.latitude},${data.longitude}`,
                                "_blank"
                              )
                            }
                            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-all duration-300"
                            title="Open Location"
                          >
                            <MapPinned size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-purple-200">
                        <div className="flex flex-col items-center">
                          <p className="text-xl font-semibold mb-2">No data available</p>
                          <p className="text-sm">No sensor data found for this coach.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>c
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoachDetails;