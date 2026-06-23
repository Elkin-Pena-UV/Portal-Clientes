"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { Icon } from "@/components/icons";

interface ToastContextValue {
  showToast: (m: string) => void;
}

const ToastCtx = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [msg, setMsg] = useState<string | null>(null);

  const showToast = useCallback((m: string) => setMsg(m), []);

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

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
