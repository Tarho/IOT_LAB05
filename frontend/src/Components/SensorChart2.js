import React, { useEffect, useState, useRef } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

const SensorChart = () => {
  const [sensorData, setSensorData] = useState([]);
  const intervalRef = useRef(null);

  useEffect(() => {
    fetchData();
    // Set up the interval to fetch data every 30 seconds
    intervalRef.current = setInterval(fetchData, 1);

    // Clean up interval on component unmount
    return () => clearInterval(intervalRef.current);
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/getAllDataL");
      const data = await response.json();
      setSensorData(data);
    } catch (error) {
      console.error("Error fetching sensor data:", error);
    }
  };

  // Extracting light data
  const light = sensorData.map((data) => data.light);
  const ids = sensorData.map((data) => data._id);

  // Building chart data
  const chartData = {
    labels: ids,
    datasets: [
      {
        label: "Light",
        data: light,
        borderColor: "rgba(200, 162, 235, 1)",
        backgroundColor: "rgba(200, 162, 235, 0.2)",
      },
    ],
  };

  // Chart options
  const chartOptions = {
    scales: {
      yAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: "Value",
          },
        },
      ],
      xAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: "Index",
          },
        },
      ],
    },
  };

  return <Line data={chartData} options={chartOptions} />;
};

export default SensorChart;
