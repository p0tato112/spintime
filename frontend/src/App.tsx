import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import AdminRoomsPage from "./pages/AdminRoomsPage";
import AdminMachinesPage from "./pages/AdminMachinesPage";
import RoomPage from "./pages/RoomPage";
import MachinePage from "./pages/MachinePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function Navbar() {
  const { role, logout } = useAuth();

  return (
    <nav style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
      <Link to="/" style={{ marginRight: "1rem" }}>
        Home
      </Link>

      {role === "admin" && (
        <>
          <Link to="/admin/rooms" style={{ marginRight: "1rem" }}>
            Admin Rooms
          </Link>
          <Link to="/admin/machines" style={{ marginRight: "1rem" }}>
            Admin Machines
          </Link>
        </>
      )}

      {role === "user" && (
        <>
          <Link to="/rooms/1" style={{ marginRight: "1rem" }}>
            Rooms
          </Link>
        </>
      )}

      {role ? (
        <button onClick={logout} style={{ marginLeft: "1rem" }}>
          Logout
        </button>
      ) : (
        <>
          <Link to="/login" style={{ marginLeft: "1rem" }}>
            Login
          </Link>
          <Link to="/register" style={{ marginLeft: "1rem" }}>
            Register
          </Link>
        </>
      )}
    </nav>
  );
}

// Small helper for protecting routes
function RequireRole({ role, children }: { role: "user" | "admin"; children: React.ReactNode }) {
  const { role: currentRole } = useAuth();
  if (currentRole !== role) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />

        <Routes>
          <Route path="/" element={<h1>Welcome to Spintime</h1>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Admin pages (protected) */}
          <Route
            path="/admin/rooms"
            element={
              <RequireRole role="admin">
                <AdminRoomsPage />
              </RequireRole>
            }
          />
          <Route
            path="/admin/machines"
            element={
              <RequireRole role="admin">
                <AdminMachinesPage />
              </RequireRole>
            }
          />

          {/* User pages (protected) */}
          <Route
            path="/rooms/:roomId"
            element={
              <RequireRole role="user">
                <RoomPage />
              </RequireRole>
            }
          />
          <Route
            path="/machines/:machineId"
            element={
              <RequireRole role="user">
                <MachinePage />
              </RequireRole>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
