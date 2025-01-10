import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { api } from "../../../api/apiClient";
import "./CinemaSeats.css";

const SEAT_TYPES = {
  [-1]: { name: "Not Placeable", color: "#424242" }, // Dark gray for not placeable
  0: { name: "Placeable", color: "#4CAFEB" }, // Light Blue for placeable
  1: { name: "Standard", color: "#C0C0C0" }, // Light Gray for standard
  2: { name: "VIP", color: "#FFD700" }, // Gold for VIP
  3: { name: "Lovers", color: "#FF4081" }, // Bright Pink for lovers
  4: { name: "Bed", color: "#6A0DAD" }, // Deep Purple for bed seats
};

const CinemaSeats = () => {
  const { screenId } = useParams();
  const navigate = useNavigate();
  const [seats, setSeats] = useState([]);
  const [screenInfo, setScreenInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch screen info and seats data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [screenData, seatsData] = await Promise.all([
          api.screens.getById(screenId),
          api.seats.getAllByScreenId(screenId),
        ]);

        setScreenInfo(screenData);

        // Transform seats data into a matrix
        const seatsMatrix = transformSeatsToMatrix(seatsData);
        setSeats(seatsMatrix);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [screenId]);

  // Transform the flat seats array into a matrix
  const transformSeatsToMatrix = (seatsData) => {
    const matrix = Array(15) // 15 rows
      .fill()
      .map(() => Array(10).fill(null)); //10 columns

    seatsData.forEach((seat) => {
      matrix[seat.row][seat.col] = {
        ...seat,
        type: SEAT_TYPES[seat.typeId] || SEAT_TYPES[0],
      };
    });

    return matrix;
  };

  if (isLoading) return <div className="loading">Loading seats...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="cinema-seats-container">
      <div className="seats-header">
        <button
          className="back-button"
          onClick={() => navigate(`/cinema/${screenInfo?.cinema?.id}/screens`)}
        >
          <ArrowLeft size={16} />
          <span>Back to Screens</span>
        </button>
        <div className="screen-info">
          <h1>Cinema: {screenInfo?.cinema?.name}</h1>
          <h1> Screen: {screenInfo?.name}</h1>
          <p>Screen Type: {screenInfo?.screenType?.name}</p>
        </div>
      </div>

      <div className="seats-layout">
        {/* Screen representation */}
        <div className="screen">
          <div className="screen-curve">Screen</div>
        </div>

        {/* Seats matrix */}
        <div className="seats-matrix">
          {seats.map((row, rowIndex) => (
            <div key={rowIndex} className="seat-row">
              {row.map((seat, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className="seat"
                  style={{
                    backgroundColor: seat
                      ? seat.type.color
                      : SEAT_TYPES[0].color,
                    border: `1px solid ${
                      seat ? seat.type.color : SEAT_TYPES[0].color
                    }`,
                  }}
                  title={
                    seat ? `${seat.name} (${seat.type.name})` : "Placeable"
                  }
                >
                  {seat && <span className="seat-name">{seat.name}</span>}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="seats-legend">
          {Object.values(SEAT_TYPES).map((type) => (
            <div key={type.name} className="legend-item">
              <div
                className="legend-color"
                style={{ backgroundColor: type.color }}
              ></div>
              <span>{type.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CinemaSeats;
