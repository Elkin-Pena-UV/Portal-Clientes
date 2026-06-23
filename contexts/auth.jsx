"use client";

import { createContext, useContext, useEffect, useState } from "react";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
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

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
