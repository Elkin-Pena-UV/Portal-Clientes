"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/icons";
import { MA, estadoCliente } from "@/lib/admin/data";
import { Pill } from "@/components/shared/primitives";
import { exportarClientesExcel } from "@/lib/admin/export-clientes";

export function ClientesView() {
  const router = useRouter();
  const [busqueda, setBusqueda] = useState("");
  const [exportando, setExportando] = useState(false);

  const lista = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return MA.clientes;
    return MA.clientes.filter((c) => [c.razon, c.nit, c.ciudad, c.contacto].join(" ").toLowerCase().includes(q));
  }, [busqueda]);

  const exportar = async () => {
    if (lista.length === 0 || exportando) return;
    setExportando(true);
    try {
      await exportarClientesExcel(lista);
    } finally {
      setExportando(false);
    }
  };

  return (
    <div className="content-inner stack">
      <div className="card">
        <div className="card-head" style={{ borderBottom: "none", paddingBottom: 4 }}>
          <h3>Clientes del portal</h3>
          <div className="spacer" />
          <div className="search"><Icon.search /><input placeholder="Buscar por razón social, NIT o ciudad…" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} /></div>
          <button className="btn btn-quiet btn-sm" onClick={exportar} disabled={lista.length === 0 || exportando}>
            <Icon.sheet /> {exportando ? "Exportando…" : "Exportar a Excel"}
          </button>
        </div>
        <div className="tbl-wrap">
          <table className="tbl">
            <thead><tr><th>Cliente</th><th>Ciudad</th><th>Cupo utilizado</th><th className="num">Disponible</th><th className="num">Cartera</th><th className="num">Vencida</th><th>Estado</th><th></th></tr></thead>
            <tbody>
              {lista.map((c) => {
                const pct = Math.round((c.cupoUtilizado / c.cupoTotal) * 100);
                const meta = estadoCliente(c);
                return (
                  <tr key={c.id}>
                    <td>
                      <div className="t-strong">{c.razon}</div>
                      <div className="t-muted t-mono" style={{ fontSize: 12 }}>NIT {c.nit}</div>
                    </td>
                    <td className="t-muted">{c.ciudad}</td>
                    <td style={{ minWidth: 150 }}>
                      <div className="between" style={{ fontSize: 12, marginBottom: 5 }}>
                        <span className="t-muted">{pct}%</span>
                        <span className="t-muted t-mono">{MA.COP(c.cupoTotal)}</span>
                      </div>
                      <div className={"progress" + (pct >= 90 ? " crit" : pct > 80 ? " warn" : "")}><span style={{ width: pct + "%" }} /></div>
                    </td>
                    <td className="num t-mono">{MA.COP(c.cupoTotal - c.cupoUtilizado)}</td>
                    <td className="num t-mono">{MA.COP(c.carteraTotal)}</td>
                    <td className="num t-mono" style={c.carteraVencida > 0 ? { color: "var(--red-ink)", fontWeight: 700 } : undefined}>{MA.COP(c.carteraVencida)}</td>
                    <td><Pill kind={meta.pill}>{meta.label}</Pill></td>
                    <td><button className="btn btn-quiet btn-sm" onClick={() => router.push("/admin/clientes/" + c.id)}>Ver <Icon.chevR /></button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {lista.length === 0 && <div className="empty">No hay clientes que coincidan con la búsqueda.</div>}
        </div>
        <div className="card-pad" style={{ paddingTop: 10, paddingBottom: 12 }}>
          <span className="hint">Cupos y cartera sincronizados desde el ERP · solo lectura</span>
        </div>
      </div>
    </div>
  );
}
