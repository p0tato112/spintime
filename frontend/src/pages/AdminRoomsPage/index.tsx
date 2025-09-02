// src/pages/AdminRoomsPage/index.tsx
import React, { useEffect, useState } from "react";
import { getRooms, createRoom, deleteRoom, type Room } from "../../services/api/rooms";

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomDesc, setNewRoomDesc] = useState("");

  useEffect(() => {
    fetchRooms();
  }, []);

  async function fetchRooms() {
    try {
      const data = await getRooms();
      setRooms(data);
    } catch (err) {
      console.error("Failed to fetch rooms", err);
    }
  }

  async function handleCreateRoom(e: React.FormEvent) {
    e.preventDefault();
    if (!newRoomName.trim()) return;

    try {
      await createRoom({ name: newRoomName, description: newRoomDesc });
      setNewRoomName("");
      setNewRoomDesc("");
      fetchRooms();
    } catch (err) {
      console.error("Failed to create room", err);
    }
  }

  async function handleDeleteRoom(id: number) {
    try {
      await deleteRoom(id);
      fetchRooms();
    } catch (err) {
      console.error("Failed to delete room", err);
    }
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Admin: Manage Rooms</h1>

      {/* Form to create new room */}
      <form onSubmit={handleCreateRoom} style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Room name"
          value={newRoomName}
          onChange={(e) => setNewRoomName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Room description"
          value={newRoomDesc}
          onChange={(e) => setNewRoomDesc(e.target.value)}
        />
        <button type="submit">Add Room</button>
      </form>

      {/* List of rooms */}
      <ul>
        {rooms.map((room) => (
          <li key={room.id}>
            <strong>{room.name}</strong> - {room.description || "No description"}
            <button
              onClick={() => handleDeleteRoom(room.id)}
              style={{ marginLeft: "1rem", color: "red" }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
