// src/pages/AdminMachinesPage/index.tsx
import React, { useEffect, useState } from "react";
import {
  getMachines,
  createMachine,
  deleteMachine,
  type Machine,
  type MachineType,
} from "../../services/api/machines";
import { getRooms, type Room } from "../../services/api/rooms";
import { getMachines as getAllMachines } from "../../services/api/machines";

function capitalize(s: string) {
  return s.length ? s[0].toUpperCase() + s.slice(1) : s;
}

export default function AdminMachinesPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [allMachines, setAllMachines] = useState<Machine[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<number | "">("");
  const [newMachineName, setNewMachineName] = useState("");
  const [newMachineType, setNewMachineType] = useState<MachineType>("washer");
  const [newMachineMinutes, setNewMachineMinutes] = useState<number>(45);

  useEffect(() => {
    fetchRooms();
    fetchAllMachines(); // populate global list for suggested id
  }, []);

  useEffect(() => {
    if (selectedRoomId !== "") {
      fetchMachines(Number(selectedRoomId));
    } else {
      setMachines([]);
    }
  }, [selectedRoomId]);

  async function fetchRooms() {
    try {
      const data = await getRooms();
      setRooms(data);
    } catch (err) {
      console.error("Failed to fetch rooms", err);
    }
  }

  async function fetchMachines(roomId: number) {
    try {
      const data = await getMachines(roomId);
      setMachines(data);
    } catch (err) {
      console.error("Failed to fetch machines", err);
    }
  }

  async function fetchAllMachines() {
    try {
      // get all machines (no room filter)
      const data = await getAllMachines();
      setAllMachines(data);
    } catch (err) {
      console.error("Failed to fetch all machines", err);
    }
  }

  // compute next global id for suggested name
  const nextGlobalId =
    allMachines.length > 0 ? Math.max(...allMachines.map((m) => m.id)) + 1 : 1;
  const suggestedName = `${capitalize(newMachineType)}${nextGlobalId}`;

  async function handleCreateMachine(e: React.FormEvent) {
    e.preventDefault();
    if (!newMachineName.trim() || selectedRoomId === "") return;

    const minutes = Math.max(1, Math.floor(newMachineMinutes));

    try {
      await createMachine({
        name: newMachineName.trim(),
        type: newMachineType,
        cycle_minutes: minutes,
        room_id: Number(selectedRoomId),
      });

      // refresh both lists (room machines + global)
      fetchMachines(Number(selectedRoomId));
      fetchAllMachines();

      setNewMachineName("");
      setNewMachineMinutes(45);
    } catch (err) {
      console.error("Failed to create machine", err);
    }
  }

  async function handleDeleteMachine(id: number) {
    try {
      await deleteMachine(id);
      if (selectedRoomId !== "") fetchMachines(Number(selectedRoomId));
      fetchAllMachines();
    } catch (err) {
      console.error("Failed to delete machine", err);
    }
  }

  // helper to render room name from room_id
  function roomNameFor(machine: Machine) {
    const found = rooms.find((r) => r.id === machine.room_id);
    return found ? found.name : `Room ${machine.room_id}`;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Admin: Manage Machines</h1>

      {/* Room selector */}
      <div style={{ margin: "1rem 0" }}>
        <label>
          Select room:{" "}
          <select
            value={selectedRoomId}
            onChange={(e) =>
              setSelectedRoomId(e.target.value === "" ? "" : Number(e.target.value))
            }
          >
            <option value="">-- Select Room --</option>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Suggestion UI */}
      {selectedRoomId !== "" && (
        <div style={{ marginBottom: "1rem" }}>
          <strong>Suggested name:</strong>{" "}
          <button
            onClick={() => setNewMachineName(suggestedName)}
            title="Click to use suggested name"
          >
            {suggestedName}
          </button>
        </div>
      )}

      {/* Form to create new machine */}
      {selectedRoomId !== "" && (
        <form
          onSubmit={handleCreateMachine}
          style={{
            marginTop: "1rem",
            display: "grid",
            gap: "0.5rem",
            maxWidth: 420,
          }}
        >
          <input
            type="text"
            placeholder="Machine name"
            value={newMachineName}
            onChange={(e) => setNewMachineName(e.target.value)}
          />

          <label>
            Type:
            <select
              value={newMachineType}
              onChange={(e) => setNewMachineType(e.target.value as MachineType)}
            >
              <option value="washer">Washer</option>
              <option value="dryer">Dryer</option>
              <option value="combo">Combo</option>
            </select>
          </label>

          <label>
            Cycle minutes:
            <input
              type="number"
              min={1}
              value={newMachineMinutes}
              onChange={(e) => setNewMachineMinutes(Number(e.target.value))}
            />
          </label>

          <div>
            <button type="submit">Add Machine</button>
          </div>
        </form>
      )}

      {/* List of machines (for the selected room) */}
      <ul style={{ marginTop: "1rem" }}>
        {machines.map((m) => (
          <li key={m.id} style={{ marginBottom: "0.5rem" }}>
            <strong>
              {m.name} (id:{m.id})
            </strong>{" "}
            — {m.type} — {m.cycle_minutes} min — <em>{roomNameFor(m)}</em> (Room {m.room_id})
            <button
              onClick={() => handleDeleteMachine(m.id)}
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
