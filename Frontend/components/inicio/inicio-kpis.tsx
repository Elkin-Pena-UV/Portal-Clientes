"use client";

import { Icon } from "@/components/icons";
import { MP } from "@/lib/data";

export function InicioKpis() {
  const activos = MP.pedidos.filter((p) => p.estado === "transito" || p.estado === "pendiente").length;
  const enTransito = MP.pedidos.filter((p) => p.estado === "transito").length;
  const enConstr = MP.pedidos.filter((p) => p.estado === "pendiente").length;

  return (
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
  );
}
