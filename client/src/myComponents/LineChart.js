import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,    // Import BarElement for bar chart
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import './ReservationFilterPage.css'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,    // Register BarElement for bar chart
  Title,
  Tooltip,
  Legend
);

const BarChart = ({ labels, data }) => {
  const chartData = {
    labels: labels, // x-axis labels (e.g., years)
    datasets: [
      {
        label: "Number of Reservations", // Label for the dataset
        data: data, // y-axis data representing reservation counts
        backgroundColor: "rgba(75,192,192,0.5)", // Bar color
        borderColor: "rgba(75,192,192,1)",       // Bar border color
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      title: {
        display: true,
        text: "Reservation Trends Over the Years",
        font: {
          size: 24, // Font size for chart title
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Dates", // x-axis label
          font: {
            size: 24, // Font size for chart title
          },
        },
      },
      y: {
        beginAtZero: true, // Start y-axis from 0
        title: {
          display: true,
          text: "Number of Reservations", // y-axis label
          font: {
            size: 24, // Font size for chart title
          },
        },
      },
    },
  };

  return (
    <>
      <div className="dashboard"> 
        <Bar data={chartData} options={options}></Bar> {/* Change Line to Bar */}
      </div>
    </>
  );
};

export default BarChart;
