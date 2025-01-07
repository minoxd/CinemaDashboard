import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import CinemaDashboard from "./Components/CinemaDashboard/CinemaDashboard";
import CinemaManagement from "./Components/CinemaDashboard/CinemaManagement/CinemaManagement";
import CinemaMovies from "./Components/CinemaDashboard/CinemaMovies/CinemaMovies";
import CinemaSchedules from "./Components/CinemaDashboard/CinemaSchedules/CinemaSchedules";
import FoodAndDrink from "./Components/CinemaDashboard/FoodAndDrink/FoodAndDrink";
import LoginSignUp from "./Components/LoginSignUp/LoginSignUp";

import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginSignUp />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Navigate to="/home" replace />
            </ProtectedRoute>
          }
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <CinemaDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cinema"
          element={
            <ProtectedRoute>
              <CinemaManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/movies"
          element={
            <ProtectedRoute>
              <CinemaMovies />
            </ProtectedRoute>
          }
        />
        <Route
          path="/schedules"
          element={
            <ProtectedRoute>
              <CinemaSchedules />
            </ProtectedRoute>
          }
        />
        <Route
          path="/food-drink"
          element={
            <ProtectedRoute>
              <FoodAndDrink />
            </ProtectedRoute>
          }
        />

        {/* Catch all route */}
        <Route
          path="*"
          element={
            localStorage.getItem("token") ? (
              <Navigate to="/home" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
