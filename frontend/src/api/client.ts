// src/api/client.ts
import { useAuth } from "../context/AuthContext";

export async function apiRequest<T>(
  url: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> {
  // Explicitly use a plain object type
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url, { ...options, headers });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API error: ${res.status} ${errorText}`);
  }

  return res.json();
}