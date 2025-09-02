// src/services/api/reservations.ts
import { apiRequest } from "./client";

export interface Reservation {
  id: number;
  machine_id: number;
  duration_minutes: number;
  start_time: string;
}

export interface ReservationCreate {
  machine_id: number;
  duration_minutes: number;
}

export async function createReservation(
  reservation: ReservationCreate
): Promise<Reservation> {
  return apiRequest<Reservation>("/reservations", {
    method: "POST",
    body: JSON.stringify(reservation),
  });
}

export async function deleteReservation(id: number): Promise<{ msg: string }> {
  return apiRequest<{ msg: string }>(`/reservations/${id}`, {
    method: "DELETE",
  });
}

// NEW: list all reservations
export async function getReservations(): Promise<Reservation[]> {
  return apiRequest<Reservation[]>("/reservations/");
}

// NEW: list reservations by machine
export async function getReservationsByMachine(
  machineId: number
): Promise<Reservation[]> {
  return apiRequest<Reservation[]>(`/reservations/by_machine/${machineId}`, {
    method: "GET",
  });
}
