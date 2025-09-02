// src/pages/RoomPage/index.tsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getMachines, type Machine } from "../../services/api/machines";

export default function RoomPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const [machines, setMachines] = useState<Machine[]>([]);

  useEffect(() => {
    if (roomId) {
      getMachines(Number(roomId))
        .then(setMachines)
        .catch((err) => console.error("Failed to fetch machines", err));
    }
  }, [roomId]);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Room {roomId}</h1>
      <ul>
        {machines.map((m) => (
          <li key={m.id}>
            {m.name} – <Link to={`/machines/${m.id}`}>View</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
