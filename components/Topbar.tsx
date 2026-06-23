import React from "react";
import { Icon } from "@/components/icons";

export function Topbar({ title, sub, actions }: {
  title: React.ReactNode;
  sub?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <header className="topbar">
      <div className="titles">
        <h1>{title}</h1>
        {sub ? <div className="sub">{sub}</div> : null}
      </div>
      <div className="actions">
        {actions}
        <button className="icon-btn" title="Notificaciones"><Icon.bell /><span className="dot" /></button>
      </div>
    </header>
  );
}
