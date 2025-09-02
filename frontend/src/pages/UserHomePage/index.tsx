import { useEffect, useState } from "react";
import { getRooms, type Room } from "../../services/api/rooms";
import { Link } from "react-router-dom";

export default function UserHomePage() {
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    getRooms().then(setRooms);
  }, []);

  return (
    <div>
      <h1>Available Laundry Rooms</h1>
      <ul>
        {rooms.map((room) => (
          <li key={room.id}>
            <Link to={`/rooms/${room.id}`}>{room.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
