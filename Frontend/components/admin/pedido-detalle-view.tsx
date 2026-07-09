"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/icons";
import { MA, type PedidoAdmin } from "@/lib/admin/data";
import { DetalleRow, Pill } from "@/components/shared/primitives";
import { Spinner } from "@/components/ui/spinner";
import { useAdmin } from "@/components/admin/admin-provider";

interface HitoDerivado {
  k: string;
  t: string;
  d: string;
  done: boolean;
  current?: boolean;
}

/** Timeline del pedido derivado de su estado en el ERP (no se persiste; es función del dato). */
function hitosDe(p: PedidoAdmin): HitoDerivado[] {
  const creada: HitoDerivado = { k: "creada", t: "Orden creada", d: `${p.fecha} · portal del cliente`, done: true };
  if (p.estado === "anulado") {
    return [creada, { k: "anulado", t: "Anulada en el ERP", d: "Orden anulada · cupo liberado", done: true, current: true }];
  }
  const enTransito = p.estado === "transito" || p.estado === "entregado";
  return [
    creada,
    p.estado === "pendiente"
      ? { k: "cartera", t: "Aprobación de cartera", d: p.sync ? "Procesando en el ERP…" : "Pendiente de validación de cupo y despacho", done: false, current: true }
      : { k: "cartera", t: "Aprobada por cartera", d: "Cupo validado en el ERP", done: true },
    { k: "pvc", t: enTransito ? "PVC generado" : "PVC por generar", d: enTransito ? p.pvc : "Lo genera el ERP al procesar el despacho", done: enTransito },
    { k: "transito", t: "En tránsito", d: enTransito ? `${p.conductor} · ${p.placa}` : "Sin vehículo asignado", done: enTransito, current: p.estado === "transito" },
    { k: "entregado", t: p.estado === "entregado" ? "Entregado y firmado" : "Entrega", d: p.cumplido ? `${p.cumplido.hora} · firma del receptor capturada` : "Pendiente", done: p.estado === "entregado", current: p.estado === "entregado" },
  ];
}

const PROCESANDO: Record<string, string> = {
  despacho: "Solicitud de despacho enviada al ERP. El PVC y la programación del vehículo quedarán registrados cuando el procedimiento confirme.",
  entrega: "Solicitud de entrega enviada al ERP. La remisión y el cumplido quedarán registrados cuando el procedimiento confirme.",
  anulacion: "Solicitud de anulación enviada al ERP. El cupo se liberará cuando el procedimiento confirme.",
};

function GestionDespacho({ pedido }: { pedido: PedidoAdmin }) {
  const { confirmarDespacho, marcarEntregado, anularPedido } = useAdmin();
  const [placa, setPlaca] = useState("");
  const [receptor, setReceptor] = useState("");
  const [confirmandoAnulacion, setConfirmandoAnulacion] = useState(false);

  if (pedido.sync) {
    return (
      <div className="card">
        <div className="card-head"><h3>Gestión del despacho</h3></div>
        <div className="card-pad">
          <div className="muted-note">
            <Spinner style={{ width: 17, height: 17, flex: "none", marginTop: 1 }} />
            {PROCESANDO[pedido.sync.accion]}
          </div>
        </div>
      </div>
    );
  }

  if (pedido.estado === "pendiente") {
    const vehiculo = MA.vehiculos.find((v) => v.placa === placa);
    return (
      <div className="card">
        <div className="card-head"><h3>Gestión del despacho</h3></div>
        <div className="card-pad">
          <div className="muted-note" style={{ marginBottom: 16 }}>
            <Icon.info />Esta acción dispara el procedimiento de despacho en el ERP: valida cartera, genera el PVC y programa el vehículo. El estado cambia cuando el ERP confirma.
          </div>
          <div className="field-row">
            <div className="field">
              <label>Vehículo asignado<span className="req">*</span></label>
              <select className="input" value={placa} onChange={(e) => setPlaca(e.target.value)}>
                <option value="">Selecciona conductor y placa…</option>
                {MA.vehiculos.map((v) => <option key={v.placa} value={v.placa}>{v.conductor} · {v.placa}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Zona de despacho</label>
              <input className="input" value={pedido.zona} disabled />
            </div>
          </div>
          <div className="between" style={{ marginTop: 4 }}>
            {confirmandoAnulacion ? (
              <div className="row" style={{ gap: 8 }}>
                <button className="btn btn-ghost btn-sm" style={{ color: "var(--red-ink)" }} onClick={() => anularPedido(pedido.id)}>
                  <Icon.trash /> Solicitar anulación
                </button>
                <button className="btn btn-quiet btn-sm" onClick={() => setConfirmandoAnulacion(false)}>Cancelar</button>
              </div>
            ) : (
              <button className="btn btn-quiet btn-sm" style={{ color: "var(--red-ink)" }} onClick={() => setConfirmandoAnulacion(true)}>
                <Icon.trash /> Anular pedido
              </button>
            )}
            <button
              className="btn btn-primary"
              disabled={!vehiculo}
              onClick={() => vehiculo && confirmarDespacho(pedido.id, vehiculo.conductor, vehiculo.placa)}
            >
              <Icon.truck /> Solicitar despacho al ERP
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (pedido.estado === "transito") {
    return (
      <div className="card">
        <div className="card-head"><h3>Gestión del despacho</h3></div>
        <div className="card-pad">
          <div className="muted-note" style={{ marginBottom: 16 }}>
            <Icon.pen />Esta acción dispara el registro de entrega en el ERP con el nombre de quien recibe. En operación real el cumplido llega con la firma digital capturada al descargue.
          </div>
          <div className="field-row">
            <div className="field">
              <label>Receptor de la entrega<span className="req">*</span></label>
              <input className="input" placeholder="Nombre de quien recibe" value={receptor} onChange={(e) => setReceptor(e.target.value)} />
            </div>
            <div className="field">
              <label>Vehículo en ruta</label>
              <input className="input" value={`${pedido.conductor} · ${pedido.placa}`} disabled />
            </div>
          </div>
          <div className="between" style={{ marginTop: 4 }}>
            <span className="hint">PVC {pedido.pvc}</span>
            <button
              className="btn btn-primary"
              disabled={!receptor.trim()}
              onClick={() => marcarEntregado(pedido.id, receptor.trim())}
            >
              <Icon.check /> Registrar entrega en el ERP
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (pedido.estado === "anulado") {
    return (
      <div className="card">
        <div className="card-pad">
          <div className="muted-note warn"><Icon.info />Este pedido fue anulado en el ERP. No admite más acciones.</div>
        </div>
      </div>
    );
  }

  return null;
}

export function PedidoDetalleView({ id }: { id: string }) {
  const router = useRouter();
  const { getPedido } = useAdmin();
  const pedido = getPedido(id);

  if (!pedido) {
    return (
      <div className="content-inner stack">
        <div className="card">
          <div className="empty">
            <b>No encontramos el pedido {id}</b>
            <div style={{ marginTop: 12 }}>
              <button className="btn btn-ghost btn-sm" onClick={() => router.push("/admin/pedidos")}><Icon.chevL /> Volver a pedidos</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const hitos = hitosDe(pedido);

  return (
    <div className="content-inner stack">
      <div>
        <button className="btn btn-quiet btn-sm" onClick={() => router.push("/admin/pedidos")}><Icon.chevL /> Volver a pedidos</button>
      </div>

      <div className="card">
        <div className="card-head">
          <h3>Pedido {pedido.id}</h3>
          <Pill kind={MA.estados[pedido.estado].pill}>{MA.estados[pedido.estado].label}</Pill>
          {pedido.sync && <Pill kind="blue" dot={false}>Procesando en ERP…</Pill>}
          <div className="spacer" />
          <span className="hint">OC {pedido.oc} · {pedido.fecha}</span>
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
            <div className="section-title" style={{ fontSize: 14 }}>Detalle del pedido</div>
            <DetalleRow label="Cliente" value={pedido.cliente} />
            <DetalleRow label="PVC" value={pedido.pvc} />
            <DetalleRow label="Sede" value={pedido.sede.split("·")[1]} />
            <DetalleRow label="Tipo" value={pedido.tipo} />
            <DetalleRow label="Zona" value={pedido.zona} />
            <DetalleRow label="Conductor" value={pedido.conductor} />
            <DetalleRow label="Placa" value={pedido.placa} />
            <DetalleRow label="Ítems" value={pedido.items + " productos"} />
            <DetalleRow label="Valor con IVA" value={MA.COP(pedido.valor)} strong />
            {pedido.estado === "entregado" && pedido.cumplido && (
              <div className="cumplido-box">
                <div className="row" style={{ gap: 9, marginBottom: 10 }}>
                  <span className="k-ic" style={{ background: "var(--green-light)", color: "var(--green-ink)", width: 30, height: 30, borderRadius: 8 }}><Icon.check /></span>
                  <div style={{ lineHeight: 1.3 }}>
                    <b style={{ fontSize: 13.5 }}>Cumplido de entrega disponible</b>
                    <div className="t-muted" style={{ fontSize: 12 }}>Remisión {pedido.cumplido.rem} firmada · {pedido.cumplido.codigo} · Recibió {pedido.cumplido.receptor}</div>
                  </div>
                </div>
                <button className="btn btn-primary btn-block"><Icon.download /> Descargar cumplido</button>
              </div>
            )}
            <div className="hint" style={{ marginTop: 12 }}>Datos sincronizados desde el ERP · solo lectura</div>
          </div>
        </div>
      </div>

      <GestionDespacho pedido={pedido} />
    </div>
  );
}
