"use client";

import { MP } from "@/lib/data";
import { Pill } from "@/components/shared/primitives";

export function CarteraEdades() {
  const maxEdad = Math.max(...MP.cartera.edades.map((e) => e.valor));

  return (
    <div className="card-pad">
      {MP.cartera.edades.map((e) => (
        <div key={e.rango} style={{ marginBottom: 16 }}>
          <div className="between" style={{ marginBottom: 7 }}>
            <div className="row" style={{ gap: 9 }}><Pill kind={e.pill} dot={true}>{e.rango}</Pill></div>
            <b className="t-mono">{MP.COP(e.valor)}</b>
          </div>
          <div className={"progress" + (e.pill === "red" ? " crit" : e.pill === "yellow" ? " warn" : "")}><span style={{ width: (e.valor / maxEdad * 100) + "%" }} /></div>
        </div>
      ))}
      <div className="between" style={{ paddingTop: 14, marginTop: 6, borderTop: "2px solid var(--line-strong)" }}>
        <b style={{ fontSize: 15 }}>Cartera total</b>
        <b className="t-mono" style={{ fontSize: 20, color: "var(--blue)" }}>{MP.COP(MP.cartera.total)}</b>
      </div>
    </div>
  );
}
