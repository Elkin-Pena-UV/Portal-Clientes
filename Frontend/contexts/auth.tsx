"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface AuthContextValue {
  authed: boolean;
  ready: boolean;
  login: () => void;
  logout: () => void;
}

const AuthCtx = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setAuthed(sessionStorage.getItem("sm_authed") === "1");
    setReady(true);
  }, []);

  const login = () => {
    sessionStorage.setItem("sm_authed", "1");
    setAuthed(true);
  };
  const logout = () => {
    sessionStorage.removeItem("sm_authed");
    setAuthed(false);
  };

  return (
    <AuthCtx.Provider value={{ authed, ready, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
