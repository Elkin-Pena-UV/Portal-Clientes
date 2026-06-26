"use client";

import { Icon } from "@/components/icons";
import { MP, type Pedido } from "@/lib/data";
import { DetalleRow } from "@/components/shared/primitives";
import { Pill } from "@/components/shared/primitives";

export function SeguimientoCard({ pedido }: { pedido: Pedido }) {
  if (!pedido.hitos) return null;
  const hitos = pedido.hitos;
  const entregado = hitos[hitos.length - 1].done;

  return (
    <div className="card">
      <div className="card-head">
        <h3>Seguimiento — {pedido.id}</h3>
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
          <DetalleRow label="PVC" value={pedido.pvc} />
          <DetalleRow label="Sede" value={pedido.sede.split("·")[1]} />
          <DetalleRow label="Conductor" value={pedido.conductor} />
          <DetalleRow label="Placa" value={pedido.placa} />
          <DetalleRow label="Ítems" value={pedido.items + " productos"} />
          <DetalleRow label="Valor con IVA" value={MP.COP(pedido.valor)} strong />
          {entregado && pedido.cumplido ? (
            <div className="cumplido-box">
              <div className="row" style={{ gap: 9, marginBottom: 10 }}>
                <span className="k-ic" style={{ background: "var(--green-light)", color: "var(--green-ink)", width: 30, height: 30, borderRadius: 8 }}><Icon.check /></span>
                <div style={{ lineHeight: 1.3 }}>
                  <b style={{ fontSize: 13.5 }}>Cumplido de entrega disponible</b>
                  <div className="t-muted" style={{ fontSize: 12 }}>Remisión {pedido.cumplido.rem} firmada · {pedido.cumplido.codigo}</div>
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
  );
}
