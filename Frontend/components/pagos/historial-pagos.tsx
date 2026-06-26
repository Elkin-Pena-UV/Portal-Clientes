"use client";

import { MP } from "@/lib/data";
import { Pill } from "@/components/shared/primitives";

export function HistorialPagos() {
  return (
    <div className="tbl-wrap">
      <table className="tbl">
        <thead><tr><th>Registro</th><th>Motivo</th><th>Código</th><th>Estado</th><th>Fecha</th><th className="num">Valor</th><th>Moneda</th><th>Origen</th></tr></thead>
        <tbody>
          {MP.pagos.map((p, i) => (
            <tr key={i}>
              <td className="t-muted t-mono">{p.reg}</td>
              <td><Pill kind="gray" dot={false}>{p.motivo}</Pill></td>
              <td className="t-mono">{p.codigo}</td>
              <td><Pill kind={MP.pagoEstados[p.estado].pill} dot={false}>{MP.pagoEstados[p.estado].label}</Pill></td>
              <td className="t-muted">{p.fecha}</td>
              <td className="num t-mono t-strong">{MP.COP(p.valor)}</td>
              <td className="t-muted">{p.moneda}</td>
              <td className="t-muted" style={{ fontSize: 12.5 }}>{p.site}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
