import React, { createContext, useContext, useState, type ReactNode } from "react";

interface AuthContextType {
  token: string | null;
  role: "user" | "admin" | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<"user" | "admin" | null>(null);

  const login = async (username: string, password: string) => {
    const res = await fetch("http://127.0.0.1:8000/auth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ username, password }),
    });

    if (!res.ok) {
      throw new Error(await res.text());
    }

    const data = await res.json();
    const token = data.access_token;

    // decode role from JWT payload
    const payload = JSON.parse(atob(token.split(".")[1]));
    const role = payload.role || "user";

    setToken(token);
    setRole(role);
    localStorage.setItem("auth", JSON.stringify({ token, role }));
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    localStorage.removeItem("auth");
  };

  React.useEffect(() => {
    const saved = localStorage.getItem("auth");
    if (saved) {
      const { token, role } = JSON.parse(saved);
      setToken(token);
      setRole(role);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
