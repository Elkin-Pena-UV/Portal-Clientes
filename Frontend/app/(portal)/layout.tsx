"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { Footer } from "@/components/Footer";
import { Icon } from "@/components/icons";
import { useAuth } from "@/contexts/auth";
import { PortalProvider } from "@/components/portal-provider";
import { Toaster } from "@/components/ui/sonner";

interface TitleMeta {
  t: string;
  s: string;
}

const TITLES: Record<string, TitleMeta> = {
  inicio: { t: "Inicio", s: "Resumen de tu cuenta — Constructora del Pacífico S.A.S." },
  crear: { t: "Crear orden", s: "Crea pedidos manualmente o cárgalos masivamente desde Excel" },
  pedidos: { t: "Mis pedidos", s: "Seguimiento e historial de tus órdenes" },
  programacion: { t: "Programación de entregas", s: "Tus próximos despachos confirmados y programados" },
  pagos: { t: "Pagos", s: "Cupo, cartera y pagos en línea con PSE" },
  documentos: { t: "Documentos", s: "Facturas, notas, remisiones y devoluciones" },
  producto: { t: "Producto", s: "Fichas técnicas del catálogo" },
  sedes: { t: "Sedes", s: "Administra los puntos de entrega y retiro de tus pedidos" },
};

export default function PortalLayout({ children }: { children: ReactNode }) {
  const { authed, ready, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setCollapsed(localStorage.getItem("sm_sidebar_collapsed") === "1");
  }, []);

  useEffect(() => {
    if (ready && !authed) router.replace("/login");
  }, [ready, authed, router]);

  function toggleSidebar() {
    setCollapsed((c) => {
      localStorage.setItem("sm_sidebar_collapsed", c ? "0" : "1");
      return !c;
    });
  }

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  if (!ready || !authed) return null;

  const seg = pathname.split("/")[1] || "inicio";
  const meta = TITLES[seg] || TITLES.inicio;
  const actions = seg === "inicio"
    ? <button className="btn btn-primary" onClick={() => router.push("/crear")}><Icon.plus /> Nueva orden</button>
    : null;

  return (
    <PortalProvider>
      <div className={"app" + (collapsed ? " collapsed" : "")} data-sb="light" style={{ "--dens": 1 } as CSSProperties}>
        <Sidebar collapsed={collapsed} onToggle={toggleSidebar} onLogout={handleLogout} />
        <main className="main">
          <Topbar title={meta.t} sub={meta.s} actions={actions} />
          <div className="content" key={seg}>
            {children}
            <Footer />
          </div>
        </main>
      </div>
      <Toaster richColors position="top-center" />
    </PortalProvider>
  );
}
