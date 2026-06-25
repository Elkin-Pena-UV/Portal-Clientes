"use client";

import { useState } from "react";
import { Icon } from "@/components/icons";
import { MP, type EstadoPedido } from "@/lib/data";
import { Pill, DetalleRow } from "@/components/ui";

type FiltroPedido = "todos" | EstadoPedido;

export default function MisPedidosPage() {
  const [filtro, setFiltro] = useState<FiltroPedido>("todos");
  const [showFilter, setShowFilter] = useState(false);

  const activo = MP.pedidos.find((p) => p.hitos);
  // Con los datos actuales siempre existe un pedido con hitos; el guard mantiene el tipo seguro.
  if (!activo?.hitos) return null;
  const hitos = activo.hitos;
  const entregado = hitos[hitos.length - 1].done;

  const filtros: { id: FiltroPedido; label: string }[] = [
    { id: "todos", label: "Todos" },
    { id: "transito", label: "En tránsito" },
    { id: "entregado", label: "Entregados" },
    { id: "pendiente", label: "En construcción" },
    { id: "anulado", label: "Anulados" },
  ];
  const lista = filtro === "todos" ? MP.pedidos : MP.pedidos.filter((p) => p.estado === filtro);

  return (
    <div className="content-inner stack">
      {/* Seguimiento de la orden activa */}
      <div className="card">
        <div className="card-head">
          <h3>Seguimiento — {activo.id}</h3>
          <Pill kind={entregado ? "green" : "blue"}>{entregado ? "Entregado y firmado" : "En tránsito"}</Pill>
          <div className="spacer" />
          <span className="hint">Actualizado: 06 jun 2026 · 14:22</span>
        </div>
        <div className="seg-grid">
          <div className="card-pad">
            <div className="timeline">
              {hitos.map((h, i) => {
                const last = i === hitos.length - 1;
                const cls = h.current ? "current" : h.done ? "done" : "pending";
                return (
                  <div className={"tl-item " + cls} key={h.k}>
                    <div className="tl-rail">
                      <div className="tl-dot">{h.done ? <Icon.check /> : h.current ? <Icon.truck /> : <Icon.clock />}</div>
                      {!last && <div className="tl-line" />}
                    </div>
                    <div className="tl-body">
                      <b>{h.t}</b>
                      <div className="tl-meta">{h.d}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="seg-side">
            <div className="section-title" style={{ fontSize: 14 }}>Detalle del despacho</div>
            <DetalleRow label="PVC" value={activo.pvc} />
            <DetalleRow label="Sede" value={activo.sede.split("·")[1]} />
            <DetalleRow label="Conductor" value={activo.conductor} />
            <DetalleRow label="Placa" value={activo.placa} />
            <DetalleRow label="Ítems" value={activo.items + " productos"} />
            <DetalleRow label="Valor con IVA" value={MP.COP(activo.valor)} strong />
            {entregado && activo.cumplido ? (
              <div className="cumplido-box">
                <div className="row" style={{ gap: 9, marginBottom: 10 }}>
                  <span className="k-ic" style={{ background: "var(--green-light)", color: "var(--green-ink)", width: 30, height: 30, borderRadius: 8 }}><Icon.check /></span>
                  <div style={{ lineHeight: 1.3 }}>
                    <b style={{ fontSize: 13.5 }}>Cumplido de entrega disponible</b>
                    <div className="t-muted" style={{ fontSize: 12 }}>Remisión {activo.cumplido.rem} firmada · {activo.cumplido.codigo}</div>
                  </div>
                </div>
                <button className="btn btn-primary btn-block"><Icon.download /> Descargar cumplido</button>
              </div>
            ) : (
              <div className="muted-note" style={{ marginTop: 14 }}>
                <Icon.pen />La entrega se confirma con firma digital del receptor al momento del descargue.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Historial */}
      <div className="card">
        <div className="card-head" style={{ borderBottom: "none", paddingBottom: 4 }}>
          <h3>Historial de pedidos</h3>
          <div className="spacer" />
          <div className="search"><Icon.search /><input placeholder="Buscar por Cod, PVC u OC…" /></div>
          <button className="btn btn-ghost btn-sm" onClick={() => setShowFilter(true)}><Icon.filter /> Filtro general</button>
        </div>
        <div style={{ padding: "8px 20px 0" }}>
          <div className="tabs" style={{ marginBottom: 0 }}>
            {filtros.map((f) => (
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
      </div>

      {showFilter && <FiltroGeneral onClose={() => setShowFilter(false)} />}
    </div>
  );
}

function FiltroGeneral({ onClose }: { onClose: () => void }) {
  const campos: [string, string][] = [
    ["Fecha creación", "rango"], ["Cod", "text"], ["Orden de compra", "text"],
    ["Punto de entrega", "select"], ["Estado", "select"], ["Tipo documento", "select"],
    ["Forma de pago", "select"], ["Moneda", "select"], ["Estado proceso", "select"],
  ];
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="card modal-card" style={{ width: 560 }} onClick={(e) => e.stopPropagation()}>
        <div className="card-head">
          <h3>Filtro general</h3>
          <div className="spacer" />
          <button className="icon-btn" style={{ width: 32, height: 32 }} onClick={onClose}><Icon.x /></button>
        </div>
        <div className="card-pad">
          <div className="field-row" style={{ rowGap: 0 }}>
            {campos.map(([label, t]) => (
              <div className="field" key={label}>
                <label>{label}</label>
                {t === "select"
                  ? <select className="input"><option>Todos</option></select>
                  : t === "rango"
                  ? <input className="input" type="date" />
                  : <input className="input" placeholder={"Ingrese " + label.toLowerCase()} />}
              </div>
            ))}
          </div>
        </div>
        <div className="card-pad between" style={{ borderTop: "1px solid var(--line)", paddingTop: 16 }}>
          <button className="btn btn-quiet" onClick={onClose}>Limpiar</button>
          <button className="btn btn-primary" onClick={onClose}><Icon.search /> Aplicar filtro</button>
        </div>
      </div>
    </div>
  );
}
