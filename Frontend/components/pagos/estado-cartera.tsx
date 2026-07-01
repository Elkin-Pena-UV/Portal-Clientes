"use client";

import { useState } from "react";
import { Icon } from "@/components/icons";
import { MP } from "@/lib/data";
import { Pill } from "@/components/shared/primitives";
import { exportarCarteraExcel } from "@/lib/pagos/export-cartera";

export function EstadoCartera() {
  const [q, setQ] = useState("");

  const term = q.trim().toLowerCase();
  const lista = term
    ? MP.solicitudes.filter((s) =>
        [s.id, s.proceso, s.desc, s.pasarela, s.plataforma, s.recaudo, s.estado]
          .join(" ")
          .toLowerCase()
          .includes(term)
      )
    : MP.solicitudes;

  const [exportando, setExportando] = useState(false);
  const exportar = async () => {
    if (lista.length === 0 || exportando) return;
    setExportando(true);
    try {
      await exportarCarteraExcel(lista);
    } finally {
      setExportando(false);
    }
  };

  return (
    <>
      <div className="card-head" style={{ borderBottom: "none", paddingBottom: 4 }}>
        <h3>Estado de cartera</h3>
        <div className="spacer" />
        <div className="search">
          <Icon.search />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por N.º, proceso o recaudo…" />
        </div>
        <button className="btn btn-quiet btn-sm" onClick={exportar} disabled={lista.length === 0 || exportando}>
          <Icon.sheet /> {exportando ? "Exportando…" : "Exportar a Excel"}
        </button>
      </div>
      <div className="tbl-wrap">
        <table className="tbl">
          <thead><tr><th>N.º</th><th>Fecha creación</th><th className="num">Valor</th><th>Proceso</th><th>Descripción</th><th>Estado</th><th>Pasarela</th><th>Estado plataforma</th><th>Recaudo</th><th>Expira</th></tr></thead>
          <tbody>
            {lista.map((s) => (
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
        {lista.length === 0 && <div className="empty">No hay transacciones que coincidan con la búsqueda.</div>}
      </div>
    </>
  );
}
