"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Icon } from "@/components/icons";

const ToastCtx = createContext(null);

export function ToastProvider({ children }) {
  const [msg, setMsg] = useState(null);

  const showToast = useCallback((m) => setMsg(m), []);

  useEffect(() => {
    if (!msg) return;
    const id = setTimeout(() => setMsg(null), 3400);
    return () => clearTimeout(id);
  }, [msg]);

  return (
    <ToastCtx.Provider value={{ showToast }}>
      {children}
      {msg && (
        <div className="toast">
          <span className="toast-ic"><Icon.check /></span>{msg}
        </div>
      )}
    </ToastCtx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
