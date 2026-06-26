"use client";

import { useState } from "react";
import { Icon } from "@/components/icons";
import { MP, type EstadoPedido } from "@/lib/data";
import { Pill } from "@/components/shared/primitives";
import { FiltroGeneralModal } from "@/components/pedidos/filtro-general-modal";

type FiltroPedido = "todos" | EstadoPedido;

const FILTROS: { id: FiltroPedido; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "transito", label: "En tránsito" },
  { id: "entregado", label: "Entregados" },
  { id: "pendiente", label: "En construcción" },
  { id: "anulado", label: "Anulados" },
];

export function HistorialPedidos() {
  const [filtro, setFiltro] = useState<FiltroPedido>("todos");
  const [showFilter, setShowFilter] = useState(false);

  const lista = filtro === "todos" ? MP.pedidos : MP.pedidos.filter((p) => p.estado === filtro);

  return (
    <div className="card">
      <div className="card-head" style={{ borderBottom: "none", paddingBottom: 4 }}>
        <h3>Historial de pedidos</h3>
        <div className="spacer" />
        <div className="search"><Icon.search /><input placeholder="Buscar por Cod, PVC u OC…" /></div>
        <button className="btn btn-ghost btn-sm" onClick={() => setShowFilter(true)}><Icon.filter /> Filtro general</button>
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
          <thead><tr><th>Cod</th><th>PVC</th><th>Orden compra</th><th>Fecha</th><th>Sede</th><th className="num">Valor</th><th>Estado</th><th></th></tr></thead>
          <tbody>
            {lista.map((p) => (
              <tr key={p.id}>
                <td className="t-strong t-mono">{p.id}</td>
                <td className="t-muted t-mono">{p.pvc}</td>
                <td className="t-muted t-mono">{p.oc}</td>
                <td className="t-muted">{p.fecha}</td>
                <td>{p.sede.split("·")[1]}</td>
                <td className="num t-mono">{MP.COP(p.valor)}</td>
                <td><Pill kind={MP.estados[p.estado].pill}>{MP.estados[p.estado].label}</Pill></td>
                <td><button className="btn btn-quiet btn-sm">Ver <Icon.chevR /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {lista.length === 0 && <div className="empty">No hay pedidos en este estado.</div>}
      </div>

      {showFilter && <FiltroGeneralModal onClose={() => setShowFilter(false)} />}
    </div>
  );
}
