"use client";

import { Icon } from "@/components/icons";
import { MP } from "@/lib/data";

export function CupoKpis() {
  const pct = Math.round((MP.cupo.utilizado / MP.cupo.total) * 100);

  return (
    <div className="kpi-row">
      <div className="kpi blue">
        <div className="k-top"><span className="k-ic"><Icon.shield /></span>Cupo total asignado</div>
        <div className="k-val">{MP.COP(MP.cupo.total)}</div>
      </div>
      <div className="kpi orange">
        <div className="k-top"><span className="k-ic"><Icon.wallet /></span>Cupo utilizado</div>
        <div className="k-val">{MP.COP(MP.cupo.utilizado)}</div>
        <div className="k-sub">{pct}% del total</div>
      </div>
      <div className="kpi blue">
        <div className="k-top"><span className="k-ic"><Icon.bolt /></span>Cupo disponible</div>
        <div className="k-val">{MP.COP(MP.cupo.disponible)}</div>
      </div>
    </div>
  );
}
