import React, { useState, useEffect } from "react";
import { sendMessage } from "./mqttService";
import SensorChart from "./SensorChart";
import SensorChart1 from "./SensorChart1";
import SensorChart2 from "./SensorChart2";

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

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 6000); // Auto-refresh every 6 seconds
    return () => clearInterval(interval); // Clean up the interval on unmount
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
            { type: "Light", value: data.light, date: data.date, id: data.board_id, ip: data.ipaddress },
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
            { type: "Temperature", value: data.temperature, date: data.date, id: data.board_id, ip: data.ipaddress },
            { type: "Humidity", value: data.humidity, date: data.date, id: data.board_id, ip: data.ipaddress },
          ]);
        }
      })
      .catch((error) => {
        console.error("Error fetching humidity and temperature data:", error);
      });
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
            Temperature Room: {temperature !== null ? temperature : "Loading..."}
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
        {sensorLogs.slice(-3).map((log, index) => (
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
                  <h2>{log.value} {log.type === "Temperature" ? "°C" : log.type === "Humidity" ? "%" : "lux"}</h2>
                </div>
                <div className="log6">
                  <h3>{new Date(log.date).toLocaleString()}</h3>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Control;
