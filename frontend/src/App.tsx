// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.tsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App

import { useEffect, useState } from "react";
import axios from "axios";

interface Room {
  id: number;
  name: string;
  description?: string;
}

export default function App() {
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/rooms/") // backend URL
      .then(res => setRooms(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Spintime Rooms</h1>
      <ul>
        {rooms.map(room => (
          <li key={room.id} className="p-2 border rounded mb-2">
            <h2 className="font-semibold">{room.name}</h2>
            <p>{room.description}</p>
            <a href={`/rooms/${room.id}`} className="text-blue-500">View Machines</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
