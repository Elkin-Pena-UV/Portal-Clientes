"use client";

import { Icon } from "@/components/icons";
import { MA } from "@/lib/admin/data";
import { Pill } from "@/components/shared/primitives";

export function AlertasCard() {
  return (
    <div className="card">
      <div className="card-head">
        <h3>Requiere atención</h3>
        <div className="spacer" />
        <Pill kind="red">{MA.alertas.length}</Pill>
      </div>
      <div className="card-pad" style={{ paddingTop: 8 }}>
        {MA.alertas.map((a) => {
          const Ic = Icon[a.icon];
          return (
            <div key={a.titulo} className="between" style={{ gap: 12, alignItems: "flex-start", padding: "11px 0", borderBottom: "1px solid var(--line)" }}>
              <span className="k-ic" style={{ width: 30, height: 30, borderRadius: 8, display: "grid", placeItems: "center", flex: "none", background: "var(--blue-light)", color: "var(--blue)" }}>
                <Ic style={{ width: 16, height: 16 }} />
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 13.5 }}>{a.titulo}</div>
                <div className="t-muted" style={{ fontSize: 12.5, marginTop: 2 }}>{a.detalle}</div>
              </div>
              <Pill kind={a.pill} dot={false}>{a.pillLabel}</Pill>
            </div>
          );
        })}
      </div>
    </div>
  );
}
