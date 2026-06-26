"use client";

import { MP } from "@/lib/data";
import { Pill } from "@/components/shared/primitives";

export function SolicitudesPse() {
  return (
    <div className="tbl-wrap">
      <table className="tbl">
        <thead><tr><th>N.º</th><th>Fecha creación</th><th className="num">Valor</th><th>Proceso</th><th>Descripción</th><th>Estado</th><th>Pasarela</th><th>Estado plataforma</th><th>Recaudo</th><th>Expira</th></tr></thead>
        <tbody>
          {MP.solicitudes.map((s) => (
            <tr key={s.id}>
              <td className="t-strong t-mono">{s.id}</td>
              <td className="t-muted t-mono">{s.fecha}</td>
              <td className="num t-mono">{MP.COP(s.valor)}</td>
              <td><Pill kind="gray" dot={false}>{s.proceso}</Pill></td>
              <td className="t-muted" style={{ fontSize: 12.5 }}>{s.desc}</td>
              <td><Pill kind={MP.pagoEstados[s.estado].pill} dot={false}>{MP.pagoEstados[s.estado].label}</Pill></td>
              <td className="t-mono">{s.pasarela}</td>
              <td><Pill kind={MP.platEstados[s.plataforma]} dot={false}>{s.plataforma}</Pill></td>
              <td className="t-mono">{s.recaudo}</td>
              <td className="t-muted t-mono" style={{ fontSize: 12 }}>{s.expira}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
