"use client";

import { Icon } from "@/components/icons";
import { MP } from "@/lib/data";

export function CreditUsage({ onNavigate }: { onNavigate: (id: string) => void }) {
  const pct = Math.round((MP.cupo.utilizado / MP.cupo.total) * 100);

  return (
    <div className="card card-pad">
      <div className="between" style={{ marginBottom: 6 }}>
        <b style={{ fontSize: 15 }}>Uso del cupo</b>
        <span className="pill orange" style={{ fontWeight: 800 }}>{pct}%</span>
      </div>
      <div className="t-muted" style={{ fontSize: 13, marginBottom: 14 }}>
        {MP.COP(MP.cupo.utilizado)} utilizados de {MP.COP(MP.cupo.total)}
      </div>
      <div className={"progress" + (pct > 80 ? " warn" : "")} style={{ height: 11 }}><span style={{ width: pct + "%" }} /></div>
      <div className="muted-note" style={{ marginTop: 16 }}>
        <Icon.info />
        Tienes {MP.COP(MP.cupo.disponible)} disponibles. El cupo se libera a medida que pagas tu cartera.
      </div>
      <button className="btn btn-primary btn-block" style={{ marginTop: 16 }} onClick={() => onNavigate("crear")}>
        <Icon.plus /> Crear nueva orden
      </button>
    </div>
  );
}
