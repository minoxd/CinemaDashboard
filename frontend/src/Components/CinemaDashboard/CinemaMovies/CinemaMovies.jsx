import React, { useState } from "react";
import { Film, Play, Clock, Plus, Search, Filter } from "lucide-react";
import CinemaHeader from "../CinemaHeader/CinemaHeader";
import CinemaSideBar from "../CinemaSideBar/CinemaSideBar";
import "./CinemaMovies.css";

const CinemaMovies = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedGenre, setSelectedGenre] = useState("all");

  const movies = [
    {
      id: 1,
      title: "Dune: Part Two",
      genre: "Sci-Fi",
      duration: "166 min",
      status: "Now Showing",
      occupancy: "75%",
      rating: "8.5",
      release: "2024",
      image: "/api/placeholder/300/400", // Using placeholder for demo
    },
    {
      id: 2,
      title: "Deadpool 3",
      genre: "Action/Comedy",
      duration: "150 min",
      status: "Coming Soon",
      occupancy: "60%",
      rating: "8.2",
      release: "2024",
      image: "/api/placeholder/300/400",
    },
    {
      id: 3,
      title: "Godzilla x Kong",
      genre: "Action/Sci-Fi",
      duration: "145 min",
      status: "Now Showing",
      occupancy: "45%",
      rating: "7.9",
      release: "2024",
      image: "/api/placeholder/300/400",
    },
    {
      id: 4,
      title: "Civil War",
      genre: "Drama/Action",
      duration: "142 min",
      status: "Coming Soon",
      occupancy: "0%",
      rating: "7.8",
      release: "2024",
      image: "/api/placeholder/300/400",
    },
  ];

  return (
    <div className="dashboard-container">
      <CinemaHeader />

      <div className="dashboard-content">
        <CinemaSideBar />

        <div className="main-content">
          {/* Movies Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Movies Management</h1>
            <button className="add-movie">
              <Plus className="add-icon" />
              <span>Add New Movie</span>
            </button>
          </div>

          {/* Movies Stats */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-content">
                <div>
                  <p className="stat-label">Total Movies</p>
                  <h3 className="stat-value">24</h3>
                </div>
                <div className="stat-icon">
                  <Film />
                </div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-content">
                <div>
                  <p className="stat-label">Now Showing</p>
                  <h3 className="stat-value">12</h3>
                </div>
                <div className="stat-icon">
                  <Play />
                </div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-content">
                <div>
                  <p className="stat-label">Coming Soon</p>
                  <h3 className="stat-value">8</h3>
                </div>
                <div className="stat-icon">
                  <Clock />
                </div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-content">
                <div>
                  <p className="stat-label">Average Occupancy</p>
                  <h3 className="stat-value">65%</h3>
                </div>
                <div className="stat-icon">
                  <Film />
                </div>
              </div>
            </div>
          </div>

          {/* Movies List */}
          <div className="info-card mt-6">
            <div className="info-header border-b border-gray-800 pb-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
                <h2 className="text-xl font-semibold">All Movies</h2>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search movies..."
                      className="bg-[#2a2a2a] text-white pl-10 pr-4 py-2 rounded-lg w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-[#e50914]"
                    />
                  </div>

                  {/* Filters */}
                  <div className="flex gap-3">
                    <div className="relative">
                      <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <select
                        value={selectedFilter}
                        onChange={(e) => setSelectedFilter(e.target.value)}
                        className="bg-[#2a2a2a] text-white pl-10 pr-8 py-2 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#e50914]"
                      >
                        <option value="all">All Status</option>
                        <option value="showing">Now Showing</option>
                        <option value="coming">Coming Soon</option>
                      </select>
                    </div>
                    <select
                      value={selectedGenre}
                      onChange={(e) => setSelectedGenre(e.target.value)}
                      className="bg-[#2a2a2a] text-white px-4 py-2 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#e50914]"
                    >
                      <option value="all">All Genres</option>
                      <option value="action">Action</option>
                      <option value="comedy">Comedy</option>
                      <option value="drama">Drama</option>
                      <option value="sci-fi">Sci-Fi</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Movies Grid */}
            <div className="movies-grid mt-6">
              {movies.map((movie) => (
                <div key={movie.id} className="movie-card cursor-pointer">
                  <div className="bg-[#1a1a1a] rounded-xl overflow-hidden hover:bg-[#252525] transition-all duration-300 border border-gray-800 hover:border-[#e50914] group">
                    {/* Movie Poster */}
                    <div className="relative w-full aspect-[2/3] overflow-hidden">
                      <img
                        src={movie.image}
                        alt={movie.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute top-3 right-3">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            movie.status === "Now Showing"
                              ? "bg-green-900/80 text-green-400 border border-green-700"
                              : "bg-yellow-900/80 text-yellow-400 border border-yellow-700"
                          }`}
                        >
                          {movie.status}
                        </span>
                      </div>
                    </div>

                    {/* Movie Info */}
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-white group-hover:text-[#e50914] transition-colors">
                            {movie.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-gray-400">
                              {movie.genre}
                            </span>
                            <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                            <span className="text-sm text-gray-400">
                              {movie.release}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 bg-[#2a2a2a] px-2 py-1 rounded-md">
                          <Film className="w-3 h-3 text-[#e50914]" />
                          <span className="text-sm font-medium">
                            {movie.rating}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-400">
                          {movie.duration}
                        </span>
                      </div>

                      <div className="flex justify-between items-center pt-3 border-t border-gray-800">
                        <span className="text-sm text-gray-400">Occupancy</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-[#2a2a2a] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#e50914] rounded-full"
                              style={{ width: movie.occupancy }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-[#e50914]">
                            {movie.occupancy}
                          </span>
                        </div>
                      </div>
                    </div>
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

export default CinemaMovies;
