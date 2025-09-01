import { useState } from "react";
import axios from "axios";

export default function MachinePage({ machineId }: { machineId: number }) {
  const [minutes, setMinutes] = useState(0);

  const handleReserve = async () => {
    const start = new Date();
    const end = new Date(start.getTime() + minutes * 60000);

    await axios.post("http://127.0.0.1:8000/reservations/", {
      user: "anon", // MVP: hardcoded or simple text input
      start_time: start.toISOString(),
      end_time: end.toISOString(),
      machine_id: machineId,
    });

    alert("Reservation created!");
  };

  return (
    <div className="p-4">
      <h1 className="text-lg font-bold">Machine #{machineId}</h1>
      <input
        type="number"
        className="border p-2 mr-2"
        placeholder="Minutes"
        value={minutes}
        onChange={(e) => setMinutes(Number(e.target.value))}
      />
      <button
        onClick={handleReserve}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Reserve
      </button>
    </div>
  );
}
