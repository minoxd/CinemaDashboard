import React, { useState } from "react";
import { Clock, Film, Plus, Filter } from "lucide-react";
import CinemaHeader from "../CinemaHeader/CinemaHeader";
import CinemaSideBar from "../CinemaSideBar/CinemaSideBar";
import "./CinemaSchedules.css";

const CinemaSchedules = () => {
  const [selectedDate, setSelectedDate] = useState("2024-12-31");

  const schedules = [
    {
      id: 1,
      movie: "Dune: Part Two",
      hall: "Hall A",
      time: "10:00 AM",
      duration: "155 min",
      capacity: "80%",
      price: "$15",
    },
    {
      id: 2,
      movie: "Deadpool 3",
      hall: "Hall B",
      time: "1:30 PM",
      duration: "120 min",
      capacity: "65%",
      price: "$12",
    },
    {
      id: 3,
      movie: "Godzilla x Kong",
      hall: "Hall A",
      time: "4:00 PM",
      duration: "132 min",
      capacity: "45%",
      price: "$15",
    },
    {
      id: 4,
      movie: "Dune: Part Two",
      hall: "Hall C",
      time: "6:30 PM",
      duration: "155 min",
      capacity: "75%",
      price: "$18",
    },
  ];

  return (
    <div className="dashboard-container">
      <CinemaHeader />

      <div className="dashboard-content">
        <CinemaSideBar />

        <div className="main-content">
          <div className="schedule-card">
            <div className="schedule-header">
              <div className="header-left">
                <h2>Movie Schedules</h2>
                <div className="date-picker">
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
              </div>
              <div className="header-actions">
                <button className="filter-button">
                  <Filter className="button-icon" />
                  <span>Filter</span>
                </button>
                <button className="add-movie">
                  <Plus className="add-icon" />
                  <span>Add Schedule</span>
                </button>
              </div>
            </div>

            <div className="schedules-grid">
              {schedules.map((schedule) => (
                <div key={schedule.id} className="schedule-item">
                  <div className="schedule-item-left">
                    <div className="movie-icon">
                      <Film />
                    </div>
                    <div className="movie-info">
                      <h3>{schedule.movie}</h3>
                      <p>{schedule.hall}</p>
                    </div>
                  </div>

                  <div className="schedule-item-right">
                    <div className="time-info">
                      <Clock className="time-icon" />
                      <span>{schedule.time}</span>
                    </div>
                    <div className="schedule-detail">
                      <p className="detail-label">Duration</p>
                      <p className="detail-value">{schedule.duration}</p>
                    </div>
                    <div className="schedule-detail">
                      <p className="detail-label">Capacity</p>
                      <p className="detail-value capacity">
                        {schedule.capacity}
                      </p>
                    </div>
                    <div className="schedule-detail">
                      <p className="detail-label">Price</p>
                      <p className="detail-value">{schedule.price}</p>
                    </div>
                    <button className="edit-button">Edit</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CinemaSchedules;
