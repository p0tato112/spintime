// src/services/api/machines.ts
import type { ReactNode } from "react";
import { apiRequest } from "./client";


export type MachineType = "washer" | "dryer" | "combo";

export interface Machine {
  room_name: ReactNode;
  id: number;
  name: string;
  room_id: number;
  type: MachineType;
  cycle_minutes: number;
}

export interface MachineCreate {
  name: string;
  room_id: number;
  type: MachineType;
  cycle_minutes: number;
}

export async function getMachine(id: number): Promise<Machine> {
  return apiRequest<Machine>(`/machines/${id}`, { method: "GET" });
}

export async function getMachines(roomId?: number): Promise<Machine[]> {
  const query = roomId ? `?room_id=${roomId}` : "";
  return apiRequest<Machine[]>(`/machines/${query}`);
}

// Add this near the other exports in src/services/api/machines.ts
export async function getMachinesByRoom(roomId: number): Promise<Machine[]> {
  return getMachines(roomId);
}

export async function createMachine(machine: MachineCreate): Promise<Machine> {
  return apiRequest<Machine>("/machines/", {
    method: "POST",
    body: JSON.stringify(machine),
  });
}

export async function deleteMachine(id: number): Promise<{ msg: string }> {
  return apiRequest<{ msg: string }>(`/machines/${id}`, {
    method: "DELETE",
  });
}
