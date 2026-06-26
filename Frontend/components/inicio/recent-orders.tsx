"use client";

import { Icon } from "@/components/icons";
import { MP } from "@/lib/data";
import { Pill } from "@/components/shared/primitives";

export function RecentOrders({ onNavigate }: { onNavigate: (id: string) => void }) {
  const recientes = MP.pedidos.slice(0, 4);

  return (
    <div className="card">
      <div className="card-head">
        <h3>Pedidos recientes</h3>
        <div className="spacer" />
        <button className="btn btn-quiet btn-sm" onClick={() => onNavigate("pedidos")}>Ver todos <Icon.chevR /></button>
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
  );
}
