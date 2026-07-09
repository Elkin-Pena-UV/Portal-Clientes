"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/icons";
import { type EstadoPedido } from "@/lib/data";
import { MA } from "@/lib/admin/data";
import { Pill } from "@/components/shared/primitives";
import { useAdmin } from "@/components/admin/admin-provider";
import { exportarPedidosAdminExcel } from "@/lib/admin/export-pedidos";

type FiltroPedido = "todos" | EstadoPedido;

const FILTROS: { id: FiltroPedido; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "pendiente", label: "Por confirmar" },
  { id: "transito", label: "En tránsito" },
  { id: "entregado", label: "Entregados" },
  { id: "anulado", label: "Anulados" },
];

export function PedidosAdminView() {
  const router = useRouter();
  const { pedidos } = useAdmin();
  const [filtro, setFiltro] = useState<FiltroPedido>("todos");
  const [clienteId, setClienteId] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [exportando, setExportando] = useState(false);

  const lista = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return pedidos.filter((p) => {
      if (filtro !== "todos" && p.estado !== filtro) return false;
      if (clienteId !== "todos" && p.clienteId !== clienteId) return false;
      if (q && ![p.id, p.pvc, p.oc, p.cliente].some((v) => v.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [pedidos, filtro, clienteId, busqueda]);

  const exportar = async () => {
    if (lista.length === 0 || exportando) return;
    setExportando(true);
    try {
      await exportarPedidosAdminExcel(lista);
    } finally {
      setExportando(false);
    }
  };

  return (
    <div className="content-inner stack">
      <div className="card">
        <div className="card-head" style={{ borderBottom: "none", paddingBottom: 4 }}>
          <h3>Pedidos de clientes</h3>
          <div className="spacer" />
          <div className="search"><Icon.search /><input placeholder="Buscar por Cod, PVC, OC o cliente…" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} /></div>
          <select className="input" style={{ width: 220 }} value={clienteId} onChange={(e) => setClienteId(e.target.value)}>
            <option value="todos">Todos los clientes</option>
            {MA.clientes.map((c) => <option key={c.id} value={c.id}>{c.razon}</option>)}
          </select>
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
            <thead><tr><th>Cod</th><th>Cliente</th><th>PVC</th><th>OC</th><th>Fecha</th><th>Sede</th><th>Tipo</th><th className="num">Valor</th><th>Estado</th><th></th></tr></thead>
            <tbody>
              {lista.map((p) => (
                <tr key={p.id}>
                  <td className="t-strong t-mono">{p.id}</td>
                  <td>{p.cliente.split(" S.A")[0]}</td>
                  <td className="t-muted t-mono">{p.pvc}</td>
                  <td className="t-muted t-mono">{p.oc}</td>
                  <td className="t-muted">{p.fecha}</td>
                  <td>{p.sede.split("·")[1]}</td>
                  <td className="t-muted">{p.tipo}</td>
                  <td className="num t-mono">{MA.COP(p.valor)}</td>
                  <td>{p.sync ? <Pill kind="blue" dot={false}>Procesando en ERP…</Pill> : <Pill kind={MA.estados[p.estado].pill}>{MA.estados[p.estado].label}</Pill>}</td>
                  <td><button className="btn btn-quiet btn-sm" onClick={() => router.push("/admin/pedidos/" + p.id)}>Ver <Icon.chevR /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
          {lista.length === 0 && <div className="empty">No hay pedidos que coincidan con el filtro.</div>}
        </div>
      </div>
    </div>
  );
}
