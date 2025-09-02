// src/pages/MachinePage/index.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMachine, type Machine } from "../../services/api/machines";
import {
  getReservationsByMachine,
  createReservation,
  type Reservation,
} from "../../services/api/reservations";

export default function MachinePage() {
  const { machineId } = useParams<{ machineId: string }>();
  const [machine, setMachine] = useState<Machine | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [minutes, setMinutes] = useState<number>(30);

  useEffect(() => {
    if (!machineId) return;

    let canceled = false;

    (async () => {
      try {
        const m = await getMachine(Number(machineId));
        if (!canceled) setMachine(m);

        const rs = await getReservationsByMachine(Number(machineId));
        if (!canceled) setReservations(rs);
      } catch (err) {
        console.error("Failed to load machine or reservations", err);
      }
    })();

    // copilot suggestion:
    // (async () => {
    //   try {
    //     const machines = await getMachines(Number(machineId));
    //     if (!canceled) setMachine(machines[0] ?? null);

    //     const rs = await getReservationsByMachine(Number(machineId));
    //     if (!canceled) setReservations(rs);
    //   } catch (err) {
    //     console.error("Failed to load machine or reservations", err);
    //   }
    // })();

    return () => {
      canceled = true;
    };
  }, [machineId]);

  async function handleReserve() {
    if (!machineId) return;
    try {
      await createReservation({
        machine_id: Number(machineId),
        duration_minutes: Number(minutes),
      });
      const updated = await getReservationsByMachine(Number(machineId));
      setReservations(updated);
      alert("Reservation created");
    } catch (err) {
      console.error("Failed to create reservation", err);
      alert("Failed to create reservation");
    }
  }

  const occupied = reservations.length > 0;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Machine {machine?.name ?? `#${machineId}`}</h1>
      <p>Type: {machine?.type ?? "—"}</p>
      <p>Status: {occupied ? "Occupied" : "Free"}</p>

      {!occupied && (
        <div>
          <input
            type="number"
            min={1}
            value={minutes}
            onChange={(e) => setMinutes(Number(e.target.value))}
          />
          <button onClick={handleReserve}>Reserve</button>
        </div>
      )}

      {occupied && (
        <div>
          <h2>Current Reservation(s)</h2>
          <ul>
            {reservations.map((r) => (
              <li key={r.id}>
                {r.duration_minutes} min — created on{" "}
                {new Intl.DateTimeFormat(undefined, {
                  dateStyle: "long",
                  timeStyle: "medium",
                }).format(new Date(r.start_time))}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
