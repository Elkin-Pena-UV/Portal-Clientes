"use client";

import { MP } from "@/lib/data";
import { SeguimientoCard } from "@/components/pedidos/seguimiento-card";
import { HistorialPedidos } from "@/components/pedidos/historial-pedidos";

export function PedidosView() {
  const activo = MP.pedidos.find((p) => p.hitos);

  return (
    <div className="content-inner stack">
      {activo && <SeguimientoCard pedido={activo} />}
      <HistorialPedidos />
    </div>
  );
}
