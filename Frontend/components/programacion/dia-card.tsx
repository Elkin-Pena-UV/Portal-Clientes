"use client";

import { Icon } from "@/components/icons";
import { MP } from "@/lib/data";
import { Pill } from "@/components/shared/primitives";

type DiaProgramacion = (typeof MP.programacion)[number];

export function DiaCard({ dia }: { dia: DiaProgramacion }) {
  return (
    <div className="card">
      <div className="card-head">
        <span className="k-ic" style={{ background: "var(--blue-light)", color: "var(--blue)", width: 32, height: 32, borderRadius: 8 }}><Icon.calendar /></span>
        <h3>{dia.dia}</h3>
        <div className="spacer" />
        <span className="hint">{dia.items.length} entrega(s)</span>
      </div>
      <div className="tbl-wrap">
        <table className="tbl">
          <thead><tr><th>Hora</th><th>PVC</th><th>Producto</th><th className="num">Cantidad</th><th>Zona</th><th>Estado</th></tr></thead>
          <tbody>
            {dia.items.map((it, i) => (
              <tr key={i}>
                <td className="t-strong t-mono">{it.hora}</td>
                <td className="t-muted t-mono">{it.pvc}</td>
                <td>{it.producto}</td>
                <td className="num t-mono">{it.cant}</td>
                <td className="t-muted">{it.zona}</td>
                <td><Pill kind={MP.progEstados[it.estado].pill}>{MP.progEstados[it.estado].label}</Pill></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
