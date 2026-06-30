"use client";

import { useState } from "react";
import { Icon } from "@/components/icons";
import { MP } from "@/lib/data";
import { Pill } from "@/components/shared/primitives";

export function HistorialPagos() {
  const [q, setQ] = useState("");

  const term = q.trim().toLowerCase();
  const lista = term
    ? MP.pagos.filter((p) =>
        [p.reg, p.motivo, p.codigo, p.fecha, p.metodo, p.site, p.estado]
          .join(" ")
          .toLowerCase()
          .includes(term)
      )
    : MP.pagos;

  return (
    <>
      <div className="card-head" style={{ borderBottom: "none", paddingBottom: 4 }}>
        <h3>Historial de pagos</h3>
        <div className="spacer" />
        <div className="search">
          <Icon.search />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por código, método o motivo…" />
        </div>
      </div>
      <div className="tbl-wrap">
        <table className="tbl">
          <thead><tr><th>Registro</th><th>Motivo</th><th>Código</th><th>Estado</th><th>Fecha</th><th className="num">Valor</th><th>Moneda</th><th>Método de pago</th><th>Origen</th></tr></thead>
          <tbody>
            {lista.map((p, i) => (
              <tr key={i}>
                <td className="t-muted t-mono">{p.reg}</td>
                <td><Pill kind="gray" dot={false}>{p.motivo}</Pill></td>
                <td className="t-mono">{p.codigo}</td>
                <td><Pill kind={MP.pagoEstados[p.estado].pill} dot={false}>{MP.pagoEstados[p.estado].label}</Pill></td>
                <td className="t-muted">{p.fecha}</td>
                <td className="num t-mono t-strong">{MP.COP(p.valor)}</td>
                <td className="t-muted">{p.moneda}</td>
                <td><Pill kind="blue" dot={false}>{p.metodo}</Pill></td>
                <td className="t-muted" style={{ fontSize: 12.5 }}>{p.site}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {lista.length === 0 && <div className="empty">No hay pagos que coincidan con la búsqueda.</div>}
      </div>
    </>
  );
}
