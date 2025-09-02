import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AdminRoomsPage from "./pages/AdminRoomsPage";
import AdminMachinesPage from "./pages/AdminMachinesPage";
import RoomPage from "./pages/RoomPage";
import MachinePage from "./pages/MachinePage";
import UserHomePage from "./pages/UserHomePage";
import UserRoomPage from "./pages/UserRoomPage";
import UserMachinePage from "./pages/UserMachinePage";


export default function App() {
  return (
    <Router>
      <nav style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
        <Link to="/" style={{ marginRight: "1rem" }}>Home</Link>
        <Link to="/admin/rooms" style={{ marginRight: "1rem" }}>Admin Rooms</Link>
        <Link to="/admin/machines">Admin Machines</Link>
      </nav>

      <Routes>
        {/* Home page */}
        <Route path="/" element={<UserHomePage />} />

        {/* Admin pages */}
        <Route path="/admin/rooms" element={<AdminRoomsPage />} />
        <Route path="/admin/machines" element={<AdminMachinesPage />} />

        {/* User pages */}
        <Route path="/rooms/:roomId" element={<UserRoomPage />} />
        <Route path="/machines/:machineId" element={<UserMachinePage />} />
      </Routes>
    </Router>
  );
}

