"use client";

import { AdminKpis } from "@/components/admin/admin-kpis";
import { PedidosRecientes } from "@/components/admin/pedidos-recientes";
import { AlertasCard } from "@/components/admin/alertas-card";

export function DashboardView() {
  return (
    <div className="content-inner stack">
      <AdminKpis />
      <div className="grid-2-1">
        <PedidosRecientes />
        <AlertasCard />
      </div>
    </div>
  );
}
