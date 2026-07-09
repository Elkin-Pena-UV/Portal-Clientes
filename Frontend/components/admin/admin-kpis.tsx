"use client";

import { Icon } from "@/components/icons";
import { MA } from "@/lib/admin/data";
import { useAdmin } from "@/components/admin/admin-provider";

export function AdminKpis() {
  const { pedidos } = useAdmin();
  const porConfirmar = pedidos.filter((p) => p.estado === "pendiente").length;
  const enTransito = pedidos.filter((p) => p.estado === "transito").length;
  const carteraTotal = MA.clientes.reduce((s, c) => s + c.carteraTotal, 0);
  const carteraVencida = MA.clientes.reduce((s, c) => s + c.carteraVencida, 0);
  const valorPendiente = pedidos
    .filter((p) => p.estado === "pendiente")
    .reduce((s, p) => s + p.valor, 0);

  return (
    <div className="kpi-row">
      <div className="kpi orange">
        <div className="k-top"><span className="k-ic"><Icon.box /></span>Pedidos por confirmar</div>
        <div className="k-val">{porConfirmar}</div>
        <div className="k-sub">{MA.COP(valorPendiente)} en órdenes esperando aprobación</div>
      </div>
      <div className="kpi blue">
        <div className="k-top"><span className="k-ic"><Icon.truck /></span>Despachos en tránsito</div>
        <div className="k-val">{enTransito}</div>
        <div className="k-sub">de {pedidos.length} pedidos en el período</div>
      </div>
      <div className="kpi yellow">
        <div className="k-top"><span className="k-ic"><Icon.wallet /></span>Cartera por cobrar</div>
        <div className="k-val">{MA.COP(carteraTotal)}</div>
        <div className="k-sub">{MA.COP(carteraVencida)} vencida · {MA.clientes.length} clientes</div>
      </div>
    </div>
  );
}
