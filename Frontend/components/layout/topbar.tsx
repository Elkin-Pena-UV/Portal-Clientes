import React from "react";
import { Icon } from "@/components/icons";

export function Topbar({ title, sub, actions, onMenu }: {
  title: React.ReactNode;
  sub?: React.ReactNode;
  actions?: React.ReactNode;
  onMenu?: () => void;
}) {
  return (
    <header className="topbar">
      <button className="menu-btn" onClick={onMenu} title="Abrir menú" aria-label="Abrir menú">
        <Icon.menu />
      </button>
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
