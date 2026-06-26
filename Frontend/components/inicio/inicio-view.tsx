"use client";

import { useRouter } from "next/navigation";
import { InicioKpis } from "@/components/inicio/inicio-kpis";
import { QuickAccess } from "@/components/inicio/quick-access";
import { RecentOrders } from "@/components/inicio/recent-orders";
import { CreditUsage } from "@/components/inicio/credit-usage";

export function InicioView() {
  const router = useRouter();
  const nav = (id: string) => router.push("/" + id);

  return (
    <div className="content-inner stack">
      <InicioKpis />
      <QuickAccess onNavigate={nav} />
      <div className="grid-2-1">
        <RecentOrders onNavigate={nav} />
        <CreditUsage onNavigate={nav} />
      </div>
    </div>
  );
}
