"use client";

import { useRouter } from "next/navigation";
import { Icon, type IconName } from "@/components/icons";
import { MP } from "@/lib/data";
import { Pill } from "@/components/ui";

interface Acceso {
  id: string;
  t: string;
  d: string;
  ic: IconName;
  c: string;
}

export default function InicioPage() {
  const router = useRouter();
  const nav = (id: string) => router.push("/" + id);

  const pct = Math.round((MP.cupo.utilizado / MP.cupo.total) * 100);
  const recientes = MP.pedidos.slice(0, 4);
  const activos = MP.pedidos.filter((p) => p.estado === "transito" || p.estado === "pendiente").length;
  const enTransito = MP.pedidos.filter((p) => p.estado === "transito").length;
  const enConstr = MP.pedidos.filter((p) => p.estado === "pendiente").length;

  const accesos: Acceso[] = [
    { id: "crear", t: "Crear orden", d: "Nueva orden de compra", ic: "plus", c: "orange" },
    { id: "pedidos", t: "Mis pedidos", d: "Seguimiento e historial", ic: "box", c: "blue" },
    { id: "programacion", t: "Programación", d: "Próximas entregas", ic: "calendar", c: "blue" },
    { id: "pagos", t: "Pagos", d: "Cartera y PSE", ic: "wallet", c: "orange" },
    { id: "documentos", t: "Documentos", d: "Facturas y remisiones", ic: "doc", c: "blue" },
    { id: "producto", t: "Producto", d: "Fichas técnicas", ic: "sheet", c: "orange" },
  ];

  return (
    <div className="content-inner stack">
      <div className="kpi-row">
        <div className="kpi blue">
          <div className="k-top"><span className="k-ic"><Icon.shield /></span>Cupo disponible</div>
          <div className="k-val">{MP.COP(MP.cupo.disponible)}</div>
          <div className="k-sub">de {MP.COP(MP.cupo.total)} asignado</div>
        </div>
        <div className="kpi yellow">
          <div className="k-top"><span className="k-ic"><Icon.wallet /></span>Cartera total</div>
          <div className="k-val">{MP.COP(MP.cartera.total)}</div>
          <div className="k-sub">{MP.COP(MP.cartera.edades[3].valor + MP.cartera.edades[4].valor)} vencida</div>
        </div>
        <div className="kpi orange">
          <div className="k-top"><span className="k-ic"><Icon.box /></span>Pedidos activos</div>
          <div className="k-val">{activos}</div>
          <div className="k-sub">{enTransito} en tránsito · {enConstr} en construcción</div>
        </div>
      </div>

      <div>
        <div className="section-title">Accesos rápidos</div>
        <div className="acc-grid">
          {accesos.map((a) => {
            const Ic = Icon[a.ic];
            return (
              <button className="acc-card" key={a.id} onClick={() => nav(a.id)}>
                <span className={"acc-ic " + a.c}><Ic /></span>
                <div className="acc-tx"><b>{a.t}</b><span>{a.d}</span></div>
                <Icon.chevR />
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid-2-1">
        <div className="card">
          <div className="card-head">
            <h3>Pedidos recientes</h3>
            <div className="spacer" />
            <button className="btn btn-quiet btn-sm" onClick={() => nav("pedidos")}>Ver todos <Icon.chevR /></button>
          </div>
          <div className="tbl-wrap">
            <table className="tbl">
              <thead><tr><th>Pedido</th><th>PVC</th><th>Fecha</th><th className="num">Valor</th><th>Estado</th></tr></thead>
              <tbody>
                {recientes.map((p) => (
                  <tr key={p.id}>
                    <td className="t-strong t-mono">{p.id}</td>
                    <td className="t-muted t-mono">{p.pvc}</td>
                    <td className="t-muted">{p.fecha}</td>
                    <td className="num t-mono">{MP.COP(p.valor)}</td>
                    <td><Pill kind={MP.estados[p.estado].pill}>{MP.estados[p.estado].label}</Pill></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card card-pad">
          <div className="between" style={{ marginBottom: 6 }}>
            <b style={{ fontSize: 15 }}>Uso del cupo</b>
            <span className="pill orange" style={{ fontWeight: 800 }}>{pct}%</span>
          </div>
          <div className="t-muted" style={{ fontSize: 13, marginBottom: 14 }}>
            {MP.COP(MP.cupo.utilizado)} utilizados de {MP.COP(MP.cupo.total)}
          </div>
          <div className={"progress" + (pct > 80 ? " warn" : "")} style={{ height: 11 }}><span style={{ width: pct + "%" }} /></div>
          <div className="muted-note" style={{ marginTop: 16 }}>
            <Icon.info />
            Tienes {MP.COP(MP.cupo.disponible)} disponibles. El cupo se libera a medida que pagas tu cartera.
          </div>
          <button className="btn btn-primary btn-block" style={{ marginTop: 16 }} onClick={() => nav("crear")}>
            <Icon.plus /> Crear nueva orden
          </button>
        </div>
      </div>
    </div>
  );
}
