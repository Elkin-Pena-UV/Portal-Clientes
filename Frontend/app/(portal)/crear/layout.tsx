"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const TABS = [
  { href: "/crear/pedido", label: "Crear pedido" },
  { href: "/crear/excel", label: "Cargar Excel" },
];

export default function CrearLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="content-inner">
      {/* Barra de navegación compartida entre las dos subrutas de Crear orden */}
      <div className="tabs">
        {TABS.map((t) => {
          const active = pathname === t.href || pathname.startsWith(t.href + "/");
          return (
            <Link key={t.href} href={t.href} className={"tab" + (active ? " on" : "")}>
              {t.label}
            </Link>
          );
        })}
      </div>
      {children}
    </div>
  );
}
