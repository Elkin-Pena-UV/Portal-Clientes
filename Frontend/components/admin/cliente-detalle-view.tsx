"use client";

import { useRouter } from "next/navigation";
import { Icon } from "@/components/icons";
import { MA, estadoCliente } from "@/lib/admin/data";
import { DetalleRow, Pill } from "@/components/shared/primitives";
import { useAdmin } from "@/components/admin/admin-provider";

export function ClienteDetalleView({ id }: { id: string }) {
  const router = useRouter();
  const { pedidos } = useAdmin();
  const cliente = MA.clientes.find((c) => c.id === id);

  if (!cliente) {
    return (
      <div className="content-inner stack">
        <div className="card">
          <div className="empty">
            <b>No encontramos el cliente solicitado</b>
            <div style={{ marginTop: 12 }}>
              <button className="btn btn-ghost btn-sm" onClick={() => router.push("/admin/clientes")}><Icon.chevL /> Volver a clientes</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const meta = estadoCliente(cliente);
  const pct = Math.round((cliente.cupoUtilizado / cliente.cupoTotal) * 100);
  const pedidosCliente = pedidos.filter((p) => p.clienteId === cliente.id);
  const activos = pedidosCliente.filter((p) => p.estado === "pendiente" || p.estado === "transito").length;

  return (
    <div className="content-inner stack">
      <div className="between">
        <button className="btn btn-quiet btn-sm" onClick={() => router.push("/admin/clientes")}><Icon.chevL /> Volver a clientes</button>
        <Pill kind={meta.pill}>{meta.label}</Pill>
      </div>

      <div className="kpi-row">
        <div className="kpi blue">
          <div className="k-top"><span className="k-ic"><Icon.shield /></span>Cupo disponible</div>
          <div className="k-val">{MA.COP(cliente.cupoTotal - cliente.cupoUtilizado)}</div>
          <div className="k-sub">de {MA.COP(cliente.cupoTotal)} asignado · {pct}% utilizado</div>
        </div>
        <div className="kpi yellow">
          <div className="k-top"><span className="k-ic"><Icon.wallet /></span>Cartera total</div>
          <div className="k-val">{MA.COP(cliente.carteraTotal)}</div>
          <div className="k-sub">{MA.COP(cliente.carteraVencida)} vencida</div>
        </div>
        <div className="kpi orange">
          <div className="k-top"><span className="k-ic"><Icon.box /></span>Pedidos activos</div>
          <div className="k-val">{activos}</div>
          <div className="k-sub">de {pedidosCliente.length} pedidos en el período</div>
        </div>
      </div>

      <div className="grid-2-1">
        <div className="card">
          <div className="card-head">
            <h3>Pedidos de {cliente.razon.split(" S.A")[0]}</h3>
            <div className="spacer" />
            <button className="btn btn-quiet btn-sm" onClick={() => router.push("/admin/pedidos")}>Ver todos <Icon.chevR /></button>
          </div>
          <div className="tbl-wrap">
            <table className="tbl">
              <thead><tr><th>Cod</th><th>PVC</th><th>Fecha</th><th className="num">Valor</th><th>Estado</th><th></th></tr></thead>
              <tbody>
                {pedidosCliente.map((p) => (
                  <tr key={p.id}>
                    <td className="t-strong t-mono">{p.id}</td>
                    <td className="t-muted t-mono">{p.pvc}</td>
                    <td className="t-muted">{p.fecha}</td>
                    <td className="num t-mono">{MA.COP(p.valor)}</td>
                    <td>{p.sync ? <Pill kind="blue" dot={false}>Procesando en ERP…</Pill> : <Pill kind={MA.estados[p.estado].pill}>{MA.estados[p.estado].label}</Pill>}</td>
                    <td><button className="btn btn-quiet btn-sm" onClick={() => router.push("/admin/pedidos/" + p.id)}>Ver <Icon.chevR /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {pedidosCliente.length === 0 && <div className="empty">Este cliente no tiene pedidos en el período.</div>}
          </div>
        </div>

        <div className="stack">
          <div className="card card-pad">
            <div className="between" style={{ marginBottom: 6 }}>
              <b style={{ fontSize: 15 }}>Uso del cupo</b>
              <span className="pill orange" style={{ fontWeight: 800 }}>{pct}%</span>
            </div>
            <div className="t-muted" style={{ fontSize: 13, marginBottom: 14 }}>
              {MA.COP(cliente.cupoUtilizado)} utilizados de {MA.COP(cliente.cupoTotal)}
            </div>
            <div className={"progress" + (pct >= 90 ? " crit" : pct > 80 ? " warn" : "")} style={{ height: 11 }}><span style={{ width: pct + "%" }} /></div>
            <div className="muted-note" style={{ marginTop: 16 }}>
              <Icon.info />El cupo lo administra cartera en el ERP. Desde el portal solo se consulta.
            </div>
          </div>

          <div className="card card-pad">
            <b style={{ fontSize: 15 }}>Cartera por edades</b>
            <div style={{ marginTop: 6 }}>
              {cliente.edades.map((e) => (
                <div className="between" key={e.rango} style={{ padding: "9px 0", borderBottom: "1px solid var(--line)" }}>
                  <Pill kind={e.pill} dot={false}>{e.rango}</Pill>
                  <span className="t-mono" style={{ fontWeight: 700, fontSize: 13.5 }}>{MA.COP(e.valor)}</span>
                </div>
              ))}
              <div className="between" style={{ padding: "11px 0 2px" }}>
                <span style={{ fontWeight: 800, fontSize: 13.5 }}>Total</span>
                <span className="t-mono" style={{ fontWeight: 800, fontSize: 14, color: "var(--blue)" }}>{MA.COP(cliente.carteraTotal)}</span>
              </div>
            </div>
          </div>

          <div className="card card-pad">
            <b style={{ fontSize: 15 }}>Información</b>
            <div style={{ marginTop: 2 }}>
              <DetalleRow label="NIT" value={cliente.nit} />
              <DetalleRow label="Ciudad" value={cliente.ciudad} />
              <DetalleRow label="Contacto" value={cliente.contacto} />
              <DetalleRow label="Correo" value={cliente.correo} />
              <DetalleRow label="Teléfono" value={cliente.telefono} />
            </div>
            <div className="hint" style={{ marginTop: 12 }}>Datos sincronizados desde el ERP · solo lectura</div>
          </div>
        </div>
      </div>
    </div>
  );
}
