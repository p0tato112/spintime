import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getMachinesByRoom, type Machine } from "../../services/api/machines";

export default function UserRoomPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const [machines, setMachines] = useState<Machine[]>([]);

  useEffect(() => {
    if (roomId) {
      getMachinesByRoom(parseInt(roomId)).then(setMachines);
    }
  }, [roomId]);

  return (
    <div>
      <h1>Machines in Room {roomId}</h1>
      <ul>
        {machines.map((m) => (
          <li key={m.id}>
            <Link to={`/machines/${m.id}`}>
              {m.name} ({m.type})
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
