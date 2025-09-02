// src/pages/MachinePage/index.tsx
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { createReservation } from "../../services/api/reservations";

export default function MachinePage() {
  const { machineId } = useParams<{ machineId: string }>();
  const [minutes, setMinutes] = useState("");

  async function handleReserve(e: React.FormEvent) {
    e.preventDefault();
    if (!machineId || !minutes.trim()) return;

    try {
      await createReservation({
        machine_id: Number(machineId),
        duration_minutes: Number(minutes),
      });
      setMinutes("");
      alert("Reservation created!");
    } catch (err) {
      console.error("Failed to create reservation", err);
    }
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Machine {machineId}</h1>
      <form onSubmit={handleReserve}>
        <input
          type="number"
          placeholder="Minutes"
          value={minutes}
          onChange={(e) => setMinutes(e.target.value)}
        />
        <button type="submit">Reserve</button>
      </form>
    </div>
  );
}
