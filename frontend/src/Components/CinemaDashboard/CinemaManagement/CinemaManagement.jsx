import React, { useState, useEffect, useCallback } from "react";
import { Edit, Plus, Search, ToggleLeft, Trash2, X } from "lucide-react";
import CinemaHeader from "../CinemaHeader/CinemaHeader";
import CinemaSideBar from "../CinemaSideBar/CinemaSideBar";
import { debounce } from "lodash";
import "./CinemaManagement.css";
import apiClient from "../../../api/apiClient";

const CinemaManagement = () => {
  // State declarations
  const [cinemas, setCinemas] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedCinemas, setSelectedCinemas] = useState([]);
  const [filterValue, setFilterValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingCinema, setEditingCinema] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    cityId: 1,
    address: "",
    status: 1,
  });

  const [newCinema, setNewCinema] = useState({
    name: "",
    cityId: 1,
    address: ""
  });
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const cities = [
    { id: 1, name: "Ho Chi Minh City" },
    { id: 2, name: "Hanoi" },
    { id: 3, name: "Da Nang" },
  ];

  // Error handler function
  const handleError = useCallback((error) => {
    console.error("Error:", error);
    setError(error.message || "An error occurred");
    setTimeout(() => setError(null), 5000);
  }, []);

  const searchCinemas = useCallback(
    async (searchTerm) => {
      setIsLoading(true);
      try {
        const response = await apiClient.get(`/admin/cinema`, {
          params: { query: searchTerm },
        });
        const data = await response.data;
        const transformedData = data.map((cinema) => ({
          id: cinema.id,
          name: cinema.name,
          city: cinema.city,
          lastModifiedBy: cinema.lastModifiedBy,
          lastModifiedDate: new Intl.DateTimeFormat("en-GB", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }).format(new Date(cinema.lastModifiedDate)),
          status: cinema.status === -1 ? "inactive" : "active",
          numberOfScreens: cinema.numberOfScreens || 0,
        }));
        setCinemas(transformedData);
      } catch (error) {
        handleError(error);
      } finally {
        setIsLoading(false);
      }
    },
    [handleError]
  );

  // Debounced search function
  const debouncedSearch = React.useMemo(
    () => debounce((searchTerm) => searchCinemas(searchTerm), 300),
    [searchCinemas]
  );

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setFilterValue(value);
    debouncedSearch(value);
  };

  // Initial fetch
  useEffect(() => {
    debouncedSearch("");

    // Cleanup function to cancel pending debounced calls
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // Handle edit button click
  const handleEditClick = (cinema) => {
    setEditingCinema(cinema);
    setEditFormData({
      name: cinema.name,
      cityId: cities.find((city) => city.name === cinema.city)?.id || 1,
      address: cinema.address,
      status: cinema.status === "active" ? 1 : 0,
    });
    setShowEditForm(true);
  };

  // Handle edit form submission
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://10.147.17.110:8080/api/v1/admin/cinema/${editingCinema.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editFormData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update cinema");
      }

      setCinemas((prevCinemas) =>
        prevCinemas.map((cinema) =>
          cinema.id === editingCinema.id
            ? {
                ...cinema,
                name: editFormData.name,
                city: cities.find((city) => city.id === editFormData.cityId)
                  ?.name,
                address: editFormData.address,
                status: editFormData.status === 1 ? "active" : "inactive",
                lastModifiedDate: new Date().toLocaleDateString(),
              }
            : cinema
        )
      );

      setShowEditForm(false);
      setEditingCinema(null);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle add cinema form submission
  const handleAddCinema = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.post(`/admin/cinema`, newCinema)
      const data = await response.data;

      if (!response.ok) {
        throw new Error(data.message || "Failed to add cinema");
      }

      setCinemas((prevCinemas) => [
        {
          id: data.data.id,
          name: data.data.name,
          city: cities.find((city) => city.id === parseInt(newCinema.cityId))
            ?.name,
          address: data.data.address,
          status: data.data.status ? "active" : "inactive",
          lastModifiedBy: "Admin",
          lastModifiedDate: new Date().toLocaleDateString(),
        },
        ...prevCinemas,
      ]);

      setNewCinema({
        name: "",
        cityId: 1,
        address: "",
      });
      setShowAddForm(false);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle cinema selection
  const handleSelectCinema = (cinemaId) => {
    setSelectedCinemas((prev) =>
      prev.includes(cinemaId)
        ? prev.filter((id) => id !== cinemaId)
        : [...prev, cinemaId]
    );
  };

  // Handle select all cinemas
  const handleSelectAll = (event) => {
    setSelectedCinemas(
      event.target.checked ? filteredCinemas.map((cinema) => cinema.id) : []
    );
  };

  // Handle status toggle
  const handleStatusToggle = async (cinemaId) => {
    try {
      const response = await apiClient.patch(`/admin/cinema/${cinemaId}`);
      const data = response.data;
      if (data.status === "success") {
        setCinemas((prevCinemas) =>
          prevCinemas.map((cinema) =>
            cinema.id === cinemaId
              ? {
                  ...cinema,
                  status: data.data.status === 1 ? "active" : "inactive",
                }
              : cinema
          )
        );
      }
    } catch (error) {
      handleError(error);
    }
  };

  // Handle deactivate selected cinemas
  // Updated delete function
  const handleDeactivateSelected = async () => {
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://10.147.17.110:8080/api/v1/admin/cinema`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ cinemaIds: selectedCinemas }), // Wrap the IDs in an object
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete cinemas");
      }

      // Remove deleted cinemas from the state
      setCinemas((prevCinemas) =>
        prevCinemas.filter((cinema) => !selectedCinemas.includes(cinema.id))
      );

      setSelectedCinemas([]);
      setShowDeleteConfirmation(false);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter cinemas based on status
  const filteredCinemas = cinemas.filter((cinema) =>
    statusFilter === "all" ? true : cinema.status === statusFilter
  );

  return (
    <div className="cinema-management-container">
      <CinemaHeader />
      <div className="dashboard-content">
        <CinemaSideBar />
        <div className="main-content">
          <div className="cinema-management">
            {error && <div className="error-message">{error}</div>}

            <div className="cinema-header">
              <div className="header-title">
                <h1>Cinema Management</h1>
                <p>Manage your cinema branches</p>
              </div>
              <div className="header-actions">
                <button
                  className="deactivate-button"
                  disabled={selectedCinemas.length === 0}
                  onClick={handleDeactivateSelected}
                >
                  <Trash2 size={16} />
                  <span>Deactivate Selected</span>
                </button>
                <button
                  className="add-button"
                  onClick={() => setShowAddForm(true)}
                >
                  <Plus size={16} />
                  <span>Add New Cinema</span>
                </button>
              </div>
            </div>

            <div className="filters">
              <div className="search-box">
                <Search className="search-icon" size={20} />
                <input
                  type="text"
                  placeholder="Search cinemas by name"
                  value={filterValue}
                  onChange={handleSearchChange}
                />
                {isLoading && (
                  <span className="loading-indicator">Searching...</span>
                )}
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="status-filter"
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
                        checked={
                          selectedCinemas.length === filteredCinemas.length &&
                          filteredCinemas.length > 0
                        }
                      />
                    </th>
                    <th>Name</th>
                    <th>City</th>
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
                      <td>{cinema.lastModifiedBy}</td>
                      <td>{cinema.lastModifiedDate}</td>
                      <td>
                        <span className={`status-badge ${cinema.status}`}>
                          {cinema.status}
                        </span>
                      </td>
                      <td className="actions">
                        <button
                          className="action-button"
                          onClick={() => handleStatusToggle(cinema.id)}
                          title={`Click to ${
                            cinema.status === "active"
                              ? "deactivate"
                              : "activate"
                          }`}
                        >
                          {cinema.status === "active" ? (
                            <ToggleLeft
                              size={16}
                              style={{ color: "#2ecc71" }}
                            />
                          ) : (
                            <ToggleLeft
                              size={16}
                              style={{ color: "#e50914" }}
                            />
                          )}
                        </button>
                        <button
                          className="action-button"
                          onClick={() => handleEditClick(cinema)}
                        >
                          <Edit size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add Cinema Modal */}
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
                        placeholder="Enter cinema name"
                      />
                    </div>
                    <div className="form-group">
                      <label>City</label>
                      <select
                        value={newCinema.cityId}
                        onChange={(e) =>
                          setNewCinema({
                            ...newCinema,
                            cityId: parseInt(e.target.value),
                          })
                        }
                      >
                        {cities.map((city) => (
                          <option key={city.id} value={city.id}>
                            {city.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Address</label>
                      <input
                        type="text"
                        required
                        value={newCinema.address}
                        onChange={(e) =>
                          setNewCinema({
                            ...newCinema,
                            address: e.target.value,
                          })
                        }
                        placeholder="Enter cinema address"
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
                      <button
                        type="submit"
                        className="submit-button"
                        disabled={isLoading}
                      >
                        {isLoading ? "Adding..." : "Add Cinema"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Edit Cinema Modal */}
            {showEditForm && editingCinema && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <div className="modal-header">
                    <h2>Edit Cinema</h2>
                    <button
                      className="close-button"
                      onClick={() => {
                        setShowEditForm(false);
                        setEditingCinema(null);
                      }}
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <form onSubmit={handleEditSubmit}>
                    <div className="form-group">
                      <label>Cinema Name</label>
                      <input
                        type="text"
                        required
                        value={editFormData.name}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            name: e.target.value,
                          })
                        }
                        placeholder="Enter cinema name"
                      />
                    </div>
                    <div className="form-group">
                      <label>City</label>
                      <select
                        value={editFormData.cityId}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            cityId: parseInt(e.target.value),
                          })
                        }
                      >
                        {cities.map((city) => (
                          <option key={city.id} value={city.id}>
                            {city.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Address</label>
                      <input
                        type="text"
                        required
                        value={editFormData.address}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            address: e.target.value,
                          })
                        }
                        placeholder="Enter cinema address"
                      />
                    </div>
                    <div className="form-group">
                      <label>Status</label>
                      <select
                        value={editFormData.status}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            status: parseInt(e.target.value),
                          })
                        }
                      >
                        <option value={1}>Active</option>
                        <option value={0}>Inactive</option>
                      </select>
                    </div>
                    <div className="modal-actions">
                      <button
                        type="button"
                        className="cancel-button"
                        onClick={() => {
                          setShowEditForm(false);
                          setEditingCinema(null);
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="submit-button"
                        disabled={isLoading}
                      >
                        {isLoading ? "Updating..." : "Update Cinema"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
            {/* Delete Confirmation Modal */}
            {showDeleteConfirmation && (
              <div className="modal-overlay">
                <div className="modal-content confirmation-modal">
                  <div className="modal-header">
                    <h2>Confirm Delete</h2>
                    <button
                      className="close-button"
                      onClick={() => setShowDeleteConfirmation(false)}
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <div className="confirmation-content">
                    <p>
                      Are you sure you want to delete the selected cinema(s)?
                    </p>
                    <p className="warning-text">
                      This action cannot be undone.
                    </p>
                  </div>
                  <div className="modal-actions">
                    <button
                      type="button"
                      className="cancel-button"
                      onClick={() => setShowDeleteConfirmation(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="delete-button"
                      onClick={confirmDelete}
                      disabled={isLoading}
                    >
                      {isLoading ? "Deleting..." : "Delete"}
                    </button>
                  </div>
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
