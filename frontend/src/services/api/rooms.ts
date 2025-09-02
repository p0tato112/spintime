// src/services/api/rooms.ts
import { apiRequest } from "./client";

export interface Room {
  id: number;
  name: string;
  description?: string;
}

export interface RoomCreate {
  name: string;
  description?: string;
}

export async function getRooms(): Promise<Room[]> {
  return apiRequest<Room[]>("/rooms/");
}

export async function createRoom(room: RoomCreate): Promise<Room> {
  return apiRequest<Room>("/rooms/", {
    method: "POST",
    body: JSON.stringify(room),
  });
}

export async function deleteRoom(id: number): Promise<{ msg: string }> {
  return apiRequest<{ msg: string }>(`/rooms/${id}`, {
    method: "DELETE",
  });
}
