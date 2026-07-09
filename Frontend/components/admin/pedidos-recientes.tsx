"use client";

import { useRouter } from "next/navigation";
import { Icon } from "@/components/icons";
import { MA } from "@/lib/admin/data";
import { Pill } from "@/components/shared/primitives";
import { useAdmin } from "@/components/admin/admin-provider";

export function PedidosRecientes() {
  const router = useRouter();
  const { pedidos } = useAdmin();
  // Pendientes primero: son los que requieren acción del administrador.
  const recientes = [...pedidos]
    .sort((a, b) => (a.estado === "pendiente" ? 0 : 1) - (b.estado === "pendiente" ? 0 : 1))
    .slice(0, 6);

  return (
    <div className="card">
      <div className="card-head">
        <h3>Pedidos recientes</h3>
        <div className="spacer" />
        <button className="btn btn-quiet btn-sm" onClick={() => router.push("/admin/pedidos")}>Ver todos <Icon.chevR /></button>
      </div>
      <div className="tbl-wrap">
        <table className="tbl">
          <thead><tr><th>Cod</th><th>Cliente</th><th>Fecha</th><th className="num">Valor</th><th>Estado</th><th></th></tr></thead>
          <tbody>
            {recientes.map((p) => (
              <tr key={p.id}>
                <td className="t-strong t-mono">{p.id}</td>
                <td>{p.cliente.split(" S.A")[0]}</td>
                <td className="t-muted">{p.fecha}</td>
                <td className="num t-mono">{MA.COP(p.valor)}</td>
                <td>{p.sync ? <Pill kind="blue" dot={false}>Procesando en ERP…</Pill> : <Pill kind={MA.estados[p.estado].pill}>{MA.estados[p.estado].label}</Pill>}</td>
                <td><button className="btn btn-quiet btn-sm" onClick={() => router.push("/admin/pedidos/" + p.id)}>Ver <Icon.chevR /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
