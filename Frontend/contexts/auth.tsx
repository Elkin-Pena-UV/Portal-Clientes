"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Rol = "cliente" | "admin";

interface AuthContextValue {
  authed: boolean;
  ready: boolean;
  rol: Rol | null;
  login: (rol?: Rol) => void;
  logout: () => void;
}

const AuthCtx = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [rol, setRol] = useState<Rol | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const flag = sessionStorage.getItem("sm_authed") === "1";
    const stored = sessionStorage.getItem("sm_rol");
    setAuthed(flag);
    // Sesiones previas sin rol guardado se tratan como cliente.
    setRol(flag ? (stored === "admin" ? "admin" : "cliente") : null);
    setReady(true);
  }, []);

  const login = (r: Rol = "cliente") => {
    sessionStorage.setItem("sm_authed", "1");
    sessionStorage.setItem("sm_rol", r);
    setAuthed(true);
    setRol(r);
  };
  const logout = () => {
    sessionStorage.removeItem("sm_authed");
    sessionStorage.removeItem("sm_rol");
    setAuthed(false);
    setRol(null);
  };

  return (
    <AuthCtx.Provider value={{ authed, ready, rol, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
