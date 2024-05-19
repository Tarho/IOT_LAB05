import React, { useState, useEffect } from "react";
import { sendMessage } from "./mqttService";
import SensorChart from "./SensorChart";
import SensorChart1 from "./SensorChart1";
import SensorChart2 from "./SensorChart2";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

function ToggleButton({ topic, initialStatus }) {
  const [isOn, setIsOn] = useState(initialStatus);

  const handleClick = () => {
    const newStatus = !isOn;
    setIsOn(newStatus);
    const message = { out: newStatus ? 1 : 0 };
    sendMessage(topic, JSON.stringify(message));
  };

  return (
    <button
      className={`toggle-button ${isOn ? "on" : "off"}`}
      onClick={handleClick}
    >
      {isOn ? "Turn Off" : "Turn On"}
    </button>
  );
}

const Control = () => {
  const [light, setLightValue] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [temperature, setTemperature] = useState(null);
  const [sensorLogs, setSensorLogs] = useState([]);
  const [filter, setFilter] = useState({
    type: "All",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 6000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = () => {
    fetch(`http://localhost:8080/api/lightvalues/2`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Light sensor data:", data);
        if (data && data.light) {
          setLightValue(data.light);
          setSensorLogs((logs) => [
            ...logs,
            {
              type: "Light",
              value: data.light,
              date: data.date,
              id: data.board_id,
              ip: data.ipaddress,
            },
          ]);
        }
      })
      .catch((error) => {
        console.error("Error fetching light sensor value:", error);
      });

    fetch(`http://localhost:8080/api/temperatureSensors/1`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Humidity and Temperature data:", data);
        if (data) {
          setHumidity(data.humidity);
          setTemperature(data.temperature);
          setSensorLogs((logs) => [
            ...logs,
            {
              type: "Temperature",
              value: data.temperature,
              date: data.date,
              id: data.board_id,
              ip: data.ipaddress,
            },
            {
              type: "Humidity",
              value: data.humidity,
              date: data.date,
              id: data.board_id,
              ip: data.ipaddress,
            },
          ]);
        }
      })
      .catch((error) => {
        console.error("Error fetching humidity and temperature data:", error);
      });
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const yyyy = date.getUTCFullYear();
    const mm = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const dd = String(date.getUTCDate()).padStart(2, '0');
    const hh = String(date.getUTCHours()).padStart(2, '0');
    const min = String(date.getUTCMinutes()).padStart(2, '0');
    const ss = String(date.getUTCSeconds()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prevFilter) => ({ ...prevFilter, [name]: value }));
  };

  const filteredLogs = sensorLogs.filter((log) => {
    if (filter.type !== "All" && log.type !== filter.type) {
      return false;
    }
    if (filter.startDate && new Date(log.date) < new Date(filter.startDate)) {
      return false;
    }
    if (filter.endDate && new Date(log.date) > new Date(filter.endDate)) {
      return false;
    }
    return true;
  });

  const downloadCSV = () => {
    const headers = ["Type", "Value", "Date", "ID", "IP Address"];
    const rows = filteredLogs.map((log) => [
      log.type,
      log.value,
      new Date(log.date).toLocaleString(),
      log.id,
      log.ip,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "sensor_logs.csv");
    document.body.appendChild(link); // Required for FF
    link.click();
  };

  const downloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      filteredLogs.map((log) => ({
        Type: log.type,
        Value: log.value,
        Date: new Date(log.date).toLocaleString(),
        ID: log.id,
        "IP Address": log.ip,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Logs");
    XLSX.writeFile(wb, "sensor_logs.xlsx");

  };

  return (
    <div className="home-banner-container1">
      <div className="home-text-section">
        <h1 className="primary-heading1">LEDs Control Status</h1>
        <div className="container1">
          <h2>Wemos 1</h2>
          <p className="primary-text1">
            Led 1{" "}
            <ToggleButton topic={`esp8266/client1`} initialStatus={false} />
          </p>
          <div className="container">
            <p className="primary-text1">
              Led 2{" "}
              <ToggleButton topic={`esp8266/client2`} initialStatus={false} />
            </p>
          </div>
        </div>
        <div className="container1">
          <h2>Wemos 2</h2>
          <p className="primary-text1">
            Led 3{" "}
            <ToggleButton topic={`esp8266/client3`} initialStatus={false} />
          </p>
          <div className="container">
            <p className="primary-text1">
              Led 4{" "}
              <ToggleButton topic={`esp8266/client4`} initialStatus={false} />
            </p>
          </div>
        </div>
      </div>

      <div className="home-text-section1">
        <h1 className="primary-heading1">Sensor Status</h1>
        <div className="container">
          <p className="primary-text1">
            Temperature Room:{" "}
            {temperature !== null ? temperature : "Loading..."}
          </p>
        </div>
        <div className="container2">
          <SensorChart />
        </div>
        <div className="container">
          <p className="primary-text1">
            Humidity Room: {humidity !== null ? humidity : "Loading..."}
          </p>
        </div>
        <div className="container2">
          <SensorChart1 />
        </div>
        <div className="container">
          <p className="primary-text1">
            Light Room: {light !== null ? light : "Loading..."}
          </p>
        </div>
        <div className="container2">
          <SensorChart2 />
        </div>
      </div>

      <div className="container4">
        <h1>System Log</h1>
        <div className="filter-container">
          <select name="type" value={filter.type} onChange={handleFilterChange}>
            <option value="All">All</option>
            <option value="Temperature">Temperature</option>
            <option value="Humidity">Humidity</option>
            <option value="Light">Light</option>
          </select>
          <button onClick={downloadCSV}>Download CSV</button>
          <button onClick={downloadExcel}>Download Excel</button>
        </div>
        {filteredLogs.slice(-3).map((log, index) => (
          <div className="log" key={index}>
            <div className="log1">
              <div className="log2">
                <div className="log6">
                  <h3>Wemos D1</h3>
                </div>
                <div className="log6">
                  <h4>IP Address: {log.ip}</h4>
                </div>
                <div className="log6">
                  <h4>ID: {log.id}</h4>
                </div>
              </div>
              <div className="log3">
                <div className="log4">
                  <h4>{log.type}</h4>
                </div>
              </div>
              <div className="log5">
                <div className="log6">
                  <h2>
                    {log.value}{" "}
                    {log.type === "Temperature"
                      ? "°C"
                      : log.type === "Humidity"
                      ? "%"
                      : "lux"}
                  </h2>
                </div>
                <div className="log6">
                  <h3>{formatDate(log.date)}</h3>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
};

export default Control;
