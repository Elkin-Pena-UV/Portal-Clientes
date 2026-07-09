"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/icons";
import { MA, type EstadoSede } from "@/lib/admin/data";
import { Pill } from "@/components/shared/primitives";
import { useAdmin } from "@/components/admin/admin-provider";
import { exportarSedesExcel } from "@/lib/admin/export-sedes";

type FiltroSede = "todas" | EstadoSede;

export function SedesAdminView() {
  const { sedes, aprobarSede, rechazarSede } = useAdmin();
  const [filtro, setFiltro] = useState<FiltroSede>("todas");
  const [busqueda, setBusqueda] = useState("");
  const [exportando, setExportando] = useState(false);
  const [rechazando, setRechazando] = useState<string | null>(null);

  const pendientes = sedes.filter((s) => s.estado === "por_aprobar").length;

  const FILTROS: { id: FiltroSede; label: string }[] = [
    { id: "todas", label: "Todas" },
    { id: "por_aprobar", label: "Por aprobar" + (pendientes ? ` (${pendientes})` : "") },
    { id: "activa", label: "Activas" },
    { id: "rechazada", label: "Rechazadas" },
  ];

  const lista = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return sedes.filter((s) => {
      if (filtro !== "todas" && s.estado !== filtro) return false;
      if (q && ![s.nombre, s.cliente, s.ciudad, s.direccion, s.codigo ?? ""].some((v) => v.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [sedes, filtro, busqueda]);

  const exportar = async () => {
    if (lista.length === 0 || exportando) return;
    setExportando(true);
    try {
      await exportarSedesExcel(lista);
    } finally {
      setExportando(false);
    }
  };

  return (
    <div className="content-inner stack">
      {pendientes > 0 && (
        <div className="muted-note warn">
          <Icon.info />
          <span>{pendientes} sede(s) registradas por clientes esperan aprobación. Sin código del ERP no se pueden programar despachos hacia ellas.</span>
        </div>
      )}
      <div className="card">
        <div className="card-head" style={{ borderBottom: "none", paddingBottom: 4 }}>
          <h3>Sedes de clientes</h3>
          <div className="spacer" />
          <div className="search"><Icon.search /><input placeholder="Buscar por sede, cliente, código o ciudad…" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} /></div>
          <button className="btn btn-quiet btn-sm" onClick={exportar} disabled={lista.length === 0 || exportando}>
            <Icon.sheet /> {exportando ? "Exportando…" : "Exportar a Excel"}
          </button>
        </div>
        <div style={{ padding: "8px 20px 0" }}>
          <div className="tabs" style={{ marginBottom: 0 }}>
            {FILTROS.map((f) => (
              <button key={f.id} className={"tab" + (filtro === f.id ? " on" : "")} onClick={() => setFiltro(f.id)}>{f.label}</button>
            ))}
          </div>
        </div>
        <div className="tbl-wrap">
          <table className="tbl">
            <thead><tr><th>Código</th><th>Sede</th><th>Cliente</th><th>Ciudad</th><th>Tipo</th><th>Estado</th><th></th></tr></thead>
            <tbody>
              {lista.map((s) => (
                <tr key={s.id}>
                  <td className="t-strong t-mono">{s.codigo ?? "—"}</td>
                  <td>
                    <div className="t-strong">{s.nombre}</div>
                    <div className="t-muted" style={{ fontSize: 12 }}>{s.direccion}</div>
                  </td>
                  <td>{s.cliente.split(" S.A")[0].split(" Ltda")[0]}</td>
                  <td className="t-muted">{s.ciudad}</td>
                  <td><Pill kind="gray" dot={false}>{MA.tiposPunto[s.tipo]}</Pill></td>
                  <td>
                    {s.sync
                      ? <Pill kind="blue" dot={false}>Codificando en ERP…</Pill>
                      : <Pill kind={MA.estadosSede[s.estado].pill}>{MA.estadosSede[s.estado].label}</Pill>}
                    {s.estado === "por_aprobar" && !s.sync && s.fechaSolicitud && (
                      <div className="t-muted" style={{ fontSize: 11.5, marginTop: 3 }}>Solicitada el {s.fechaSolicitud}</div>
                    )}
                  </td>
                  <td>
                    {s.estado === "por_aprobar" && !s.sync && (
                      rechazando === s.id ? (
                        <div className="row" style={{ gap: 6, justifyContent: "flex-end" }}>
                          <button className="btn btn-ghost btn-sm" style={{ color: "var(--red-ink)" }} onClick={() => { rechazarSede(s.id); setRechazando(null); }}>
                            Confirmar rechazo
                          </button>
                          <button className="btn btn-quiet btn-sm" onClick={() => setRechazando(null)}>Cancelar</button>
                        </div>
                      ) : (
                        <div className="row" style={{ gap: 6, justifyContent: "flex-end" }}>
                          <button className="btn btn-quiet btn-sm" style={{ color: "var(--red-ink)" }} onClick={() => setRechazando(s.id)}>Rechazar</button>
                          <button className="btn btn-primary btn-sm" onClick={() => aprobarSede(s.id)}><Icon.check /> Aprobar y codificar</button>
                        </div>
                      )
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {lista.length === 0 && <div className="empty">No hay sedes que coincidan con el filtro.</div>}
        </div>
        <div className="card-pad" style={{ paddingTop: 10, paddingBottom: 12 }}>
          <span className="hint">Los códigos de sede los asigna el ERP al aprobar · la solicitud la registra el cliente desde su portal</span>
        </div>
      </div>
    </div>
  );
}
