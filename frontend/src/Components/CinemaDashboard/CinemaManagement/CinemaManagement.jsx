import React, { useState } from "react";
import { Edit, Plus, Search, ToggleLeft, Trash2, X } from "lucide-react";
import CinemaHeader from "../CinemaHeader/CinemaHeader";
import CinemaSideBar from "../CinemaSideBar/CinemaSideBar";

const CinemaManagement = () => {
  const [cinemas, setCinemas] = useState([
    {
      id: 1,
      name: "Cinema Central",
      city: "Ho Chi Minh City",
      screens: 8,
      lastModifiedBy: "Admin",
      lastModifiedDate: "2024-01-02",
      status: "active",
    },
  ]);

  const cities = ["Ho Chi Minh City", "Hanoi", "Da Nang"];
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCinemas, setSelectedCinemas] = useState([]);
  const [filterValue, setFilterValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [newCinema, setNewCinema] = useState({
    name: "",
    city: cities[0],
    screens: "",
  });

  const handleStatusToggle = (cinemaId) => {
    setCinemas(
      cinemas.map((cinema) => {
        if (cinema.id === cinemaId) {
          return {
            ...cinema,
            status: cinema.status === "active" ? "inactive" : "active",
          };
        }
        return cinema;
      })
    );
  };

  const handleSelectCinema = (cinemaId) => {
    if (selectedCinemas.includes(cinemaId)) {
      setSelectedCinemas(selectedCinemas.filter((id) => id !== cinemaId));
    } else {
      setSelectedCinemas([...selectedCinemas, cinemaId]);
    }
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedCinemas(cinemas.map((cinema) => cinema.id));
    } else {
      setSelectedCinemas([]);
    }
  };

  const handleDeactivateSelected = () => {
    setCinemas(
      cinemas.map((cinema) => ({
        ...cinema,
        status: selectedCinemas.includes(cinema.id)
          ? "inactive"
          : cinema.status,
      }))
    );
    setSelectedCinemas([]);
  };

  const handleAddCinema = (e) => {
    e.preventDefault();
    const newId = Math.max(...cinemas.map((c) => c.id)) + 1;
    const today = new Date().toISOString().split("T")[0];

    setCinemas([
      ...cinemas,
      {
        ...newCinema,
        id: newId,
        lastModifiedBy: "Admin",
        lastModifiedDate: today,
        status: "active",
      },
    ]);

    setNewCinema({ name: "", city: cities[0], screens: "" });
    setShowAddForm(false);
  };

  const filteredCinemas = cinemas.filter((cinema) => {
    const matchesFilter = cinema.name
      .toLowerCase()
      .includes(filterValue.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || cinema.status === statusFilter;
    return matchesFilter && matchesStatus;
  });

  return (
    <div className="dashboard-container">
      <CinemaHeader />
      <div className="dashboard-content">
        <CinemaSideBar />
        <div className="main-content">
          <div className="cinema-management">
            <div className="cinema-header">
              <div className="header-title">
                <h1>Cinema</h1>
                <p>Manage the branches</p>
              </div>
              <div className="header-actions">
                <button
                  className="deactivate-button"
                  disabled={selectedCinemas.length === 0}
                  onClick={handleDeactivateSelected}
                >
                  <Trash2 size={16} />
                  Deactivate Selected
                </button>
                <button
                  className="add-button"
                  onClick={() => setShowAddForm(true)}
                >
                  <Plus size={16} />
                  Add New Cinema
                </button>
              </div>
            </div>

            <div className="filters">
              <div className="search-box">
                <Search size={20} />
                <input
                  type="text"
                  placeholder="Search cinemas..."
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="cinemas-table">
              <table>
                <thead>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        onChange={handleSelectAll}
                        checked={selectedCinemas.length === cinemas.length}
                      />
                    </th>
                    <th>Name</th>
                    <th>City</th>
                    <th>Screens</th>
                    <th>Last Modified By</th>
                    <th>Last Modified Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCinemas.map((cinema) => (
                    <tr key={cinema.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedCinemas.includes(cinema.id)}
                          onChange={() => handleSelectCinema(cinema.id)}
                        />
                      </td>
                      <td>{cinema.name}</td>
                      <td>{cinema.city}</td>
                      <td>{cinema.screens}</td>
                      <td>{cinema.lastModifiedBy}</td>
                      <td>{cinema.lastModifiedDate}</td>
                      <td>
                        <span className={`status-badge ${cinema.status}`}>
                          {cinema.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="action-button"
                          onClick={() => handleStatusToggle(cinema.id)}
                        >
                          <ToggleLeft size={16} />
                        </button>
                        <button className="action-button">
                          <Edit size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {showAddForm && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <div className="modal-header">
                    <h2>Add New Cinema</h2>
                    <button
                      className="close-button"
                      onClick={() => setShowAddForm(false)}
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <form onSubmit={handleAddCinema}>
                    <div className="form-group">
                      <label>Cinema Name</label>
                      <input
                        type="text"
                        required
                        value={newCinema.name}
                        onChange={(e) =>
                          setNewCinema({ ...newCinema, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>City</label>
                      <select
                        value={newCinema.city}
                        onChange={(e) =>
                          setNewCinema({ ...newCinema, city: e.target.value })
                        }
                      >
                        {cities.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Number of Screens</label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={newCinema.screens}
                        onChange={(e) =>
                          setNewCinema({
                            ...newCinema,
                            screens: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="modal-actions">
                      <button
                        type="button"
                        className="cancel-button"
                        onClick={() => setShowAddForm(false)}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="submit-button">
                        Add Cinema
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CinemaManagement;
