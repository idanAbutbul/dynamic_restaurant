import React, { useState, useEffect } from "react";
import LineChart from "./LineChart"; // Import LineChart component
import "./ReservationFilterPage.css";

function ReservationFilterPage() {
  const [reservations, setReservations] = useState([]);
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [week, setWeek] = useState(null);
  const [view, setView] = useState("daily"); // New state for selecting the chart view (daily, monthly, etc.)

  useEffect(() => {
    fetchReservations();
  }, [year, month, week]);

  const fetchReservations = async () => {
    try {
      const queryParams = new URLSearchParams({
        ...(year && { year }),
        ...(month && { month }),
        ...(week && { startDate: week?.startDate, endDate: week?.endDate }),
      }).toString();

      const response = await fetch(
        `http://localhost:5000/tables/reservations?${queryParams}`
      );
      const data = await response.json();
      setReservations(data);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };

  const getYears = () => {
    const years = [{ value: "", label: "All Years" }];
    for (let i = 2020; i <= 2069; i++) {
      years.push({ value: i.toString(), label: i.toString() });
    }
    return years;
  };

  const getMonths = () => {
    return [
      { value: "", label: "All Months" },
      { value: "1", label: "January" },
      { value: "2", label: "February" },
      { value: "3", label: "March" },
      { value: "4", label: "April" },
      { value: "5", label: "May" },
      { value: "6", label: "June" },
      { value: "7", label: "July" },
      { value: "8", label: "August" },
      { value: "9", label: "September" },
      { value: "10", label: "October" },
      { value: "11", label: "November" },
      { value: "12", label: "December" },
    ];
  };

  const getWeeksInMonth = (year, month) => {
    if (!year || !month) return [];
    const weeks = [];
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);

    let currentDay = firstDay;
    while (currentDay <= lastDay) {
      const weekStart = new Date(currentDay);
      weekStart.setDate(currentDay.getDate() - currentDay.getDay());

      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      if (
        weekStart.getMonth() === firstDay.getMonth() ||
        weekEnd.getMonth() === firstDay.getMonth()
      ) {
        weeks.push({ start: weekStart, end: weekEnd });
      }
      currentDay = new Date(weekEnd);
      currentDay.setDate(currentDay.getDate() + 1);
    }

    return weeks.map((week, index) => ({
      label: `Week ${
        index + 1
      } (${week.start.toLocaleDateString()} - ${week.end.toLocaleDateString()})`,
      value: JSON.stringify({
        startDate: week.start.toISOString(),
        endDate: week.end.toISOString(),
      }),
    }));
  };

  // Filter reservation data based on the selected view (daily, monthly, etc.)
  const getFilteredData = () => {
    if (!reservations.length) return { labels: [], data: [] };

    const groupedData = {};

    reservations.forEach((reservation) => {
      const date = new Date(reservation.date);
      let label;
      if (view === "daily") {
        label = date.toLocaleDateString();
      } else if (view === "monthly") {
        label = `${date.getFullYear()}-${date.getMonth() + 1}`;
      } else if (view === "weekly") {
        const weekStart = new Date(date);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        label = `${weekStart.toLocaleDateString()}`;
      }

      if (!groupedData[label]) {
        groupedData[label] = 0;
      }
      groupedData[label] += 1;
    });

    const labels = Object.keys(groupedData);
    const data = Object.values(groupedData);
    return { labels, data };
  };

  const chartData = getFilteredData();

  return (
    <>
      <div className="reservation-admin-dashboard-container">
        <h1 className="filter-h1">Reservation Filter</h1>
        <div className="filters-dashboard">
          <select
            className="filter-selector"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            {getYears().map((yearOption) => (
              <option key={yearOption.value} value={yearOption.value}>
                {yearOption.label}
              </option>
            ))}
          </select>

          <select
            className="filter-selector"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          >
            {getMonths().map((monthOption) => (
              <option key={monthOption.value} value={monthOption.value}>
                {monthOption.label}
              </option>
            ))}
          </select>

          <select
            className="filter-selector"
            value={week ? JSON.stringify(week) : ""}
            onChange={(e) => {
              const value = e.target.value;
              if (value) {
                setWeek(JSON.parse(value));
              } else {
                setWeek(null);
              }
            }}
            disabled={!year || !month}
          >
            <option value="">All Weeks</option>
            {getWeeksInMonth(year, month).map((weekOption) => (
              <option key={weekOption.value} value={weekOption.value}>
                {weekOption.label}
              </option>
            ))}
          </select>
          
          <select  className="filter-selector" value={view} onChange={(e) => setView(e.target.value)}>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      
        <LineChart labels={chartData.labels} data={chartData.data} />

        <div className="reservations-table">
          <table>
            <thead>
              <tr>
                <th>Table Size</th>
                <th>Date</th>
                <th>Time</th>
                <th>Guests</th>
                <th>Location</th>
                <th>User</th>
              </tr>
            </thead>
            <tbody>
              {reservations.length > 0 ? (
                reservations.map((reservation) => (
                  <tr key={reservation.reservationId}>
                    <td>{reservation.size}</td>
                    <td>{new Date(reservation.date).toLocaleDateString()}</td>
                    <td>{new Date(reservation.date).toLocaleTimeString()}</td>
                    <td>{reservation.how_many}</td>
                    <td>{reservation.location}</td>
                    <td>{reservation.userEmail}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No reservations found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default ReservationFilterPage;
