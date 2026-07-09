"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar, type NavGroup } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { Footer } from "@/components/layout/footer";
import { useAuth } from "@/contexts/auth";
import { MA } from "@/lib/admin/data";
import { AdminProvider, useAdmin } from "@/components/admin/admin-provider";
import { Toaster } from "@/components/ui/sonner";

interface TitleMeta {
  t: string;
  s: string;
}

const TITLES: Record<string, TitleMeta> = {
  dashboard: { t: "Dashboard", s: "Resumen operativo del portal — Cementos San Marcos" },
  pedidos: { t: "Pedidos", s: "Órdenes de todos los clientes: confirma, despacha y haz seguimiento" },
  clientes: { t: "Clientes", s: "Cupos de crédito y cartera sincronizados desde el ERP" },
  productos: { t: "Productos", s: "Catálogo, precios y fichas técnicas visibles para los clientes" },
  sedes: { t: "Sedes", s: "Puntos de entrega y retiro registrados por los clientes" },
  configuracion: { t: "Configuración", s: "Usuarios administradores, roles y parámetros del portal" },
};

function AdminShell({ children }: { children: ReactNode }) {
  const { logout } = useAuth();
  const { pedidos } = useAdmin();
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setCollapsed(localStorage.getItem("sm_sidebar_collapsed") === "1");
  }, []);

  // Cierra el drawer móvil al cambiar de ruta
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

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

  const porConfirmar = pedidos.filter((p) => p.estado === "pendiente").length;
  const nav: NavGroup[] = [
    { group: "Principal", items: [
      { id: "admin", label: "Dashboard", icon: "home", exact: true },
    ]},
    { group: "Operación", items: [
      { id: "admin/pedidos", label: "Pedidos", icon: "box", badge: porConfirmar },
      { id: "admin/clientes", label: "Clientes", icon: "user" },
    ]},
    { group: "Catálogo", items: [
      { id: "admin/productos", label: "Productos", icon: "bag" },
      { id: "admin/sedes", label: "Sedes", icon: "pin" },
    ]},
    { group: "Sistema", items: [
      { id: "admin/configuracion", label: "Configuración", icon: "sliders" },
    ]},
  ];

  const seg = pathname.split("/")[2] || "dashboard";
  const meta = TITLES[seg] || TITLES.dashboard;

  return (
    <div
      className={"app" + (collapsed ? " collapsed" : "") + (mobileOpen ? " mobile-open" : "")}
      data-sb="light"
      style={{ "--dens": 1 } as CSSProperties}
    >
      <Sidebar
        collapsed={collapsed}
        onToggle={toggleSidebar}
        onLogout={handleLogout}
        onNavigate={() => setMobileOpen(false)}
        nav={nav}
        subtitle="Portal administrativo"
        user={{ iniciales: MA.adminUser.iniciales, nombre: MA.adminUser.nombre, detalle: MA.adminUser.rol + " · San Marcos" }}
      />
      <div className="sb-overlay" onClick={() => setMobileOpen(false)} aria-hidden="true" />
      <main className="main">
        <Topbar title={meta.t} sub={meta.s} onMenu={() => setMobileOpen(true)} />
        <div className="content" key={seg}>
          {children}
          <Footer />
        </div>
      </main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { authed, ready, rol } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    if (!authed) router.replace("/login");
    else if (rol !== "admin") router.replace("/inicio");
  }, [ready, authed, rol, router]);

  if (!ready || !authed || rol !== "admin") return null;

  return (
    <AdminProvider>
      <AdminShell>{children}</AdminShell>
      <Toaster richColors position="top-center" />
    </AdminProvider>
  );
}
